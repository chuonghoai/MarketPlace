import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, EntityManager } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { WalletWithdrawal } from './entities/wallet-withdrawal.entity';
import { EWalletStatus, EWalletTransactionType, EWalletWithdrawalStatus } from './enums/wallet.enum';
import { CreateWithdrawalDto, CompleteWithdrawalDto, RejectWithdrawalDto } from './dto/wallet.dto';
import { ENV_VARS } from '../../constants/env.constants';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    @InjectRepository(WalletWithdrawal)
    private readonly withdrawalRepository: Repository<WalletWithdrawal>,
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
  ) {}

  async getOrCreateWallet(userId: string, manager?: EntityManager): Promise<Wallet> {
    const repo = manager ? manager.getRepository(Wallet) : this.walletRepository;
    let wallet = await repo.findOne({ where: { userId } });

    if (!wallet) {
      wallet = repo.create({
        userId,
        balance: 0,
        status: EWalletStatus.ACTIVE,
      });
      wallet = await repo.save(wallet);
    }

    return wallet;
  }

  async getWalletInfo(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return {
      id: wallet.id,
      balance: Number(wallet.balance),
      status: wallet.status,
      isUsable: wallet.status === EWalletStatus.ACTIVE && Number(wallet.balance) > 0,
    };
  }

  async topup(
    userId: string,
    amount: number,
    paymentMethod: 'DIRECT' | 'VNPAY' = 'DIRECT',
    ipAddr = '127.0.0.1',
    description = 'Nạp tiền vào ví điện tử',
  ) {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
    }

    if (paymentMethod === 'VNPAY') {
      const txRef = `TOPUP_${Date.now()}_${userId.slice(0, 8)}`;
      const paymentUrl = this.buildVnpayPaymentUrl(txRef, amount, ipAddr);
      return {
        paymentRequired: true,
        paymentUrl,
        txRef,
        amount,
      };
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.getOrCreateWallet(userId, queryRunner.manager);

      const wallet = await queryRunner.manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write')
        .where('wallet.userId = :userId', { userId })
        .getOne();

      if (!wallet) throw new NotFoundException('Không tìm thấy thông tin ví');
      if (wallet.status === EWalletStatus.LOCKED) {
        throw new BadRequestException('Ví của bạn đang bị tạm khóa');
      }

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + Number(amount);

      wallet.balance = balanceAfter;
      await queryRunner.manager.save(wallet);

      const tx = queryRunner.manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount: Number(amount),
        type: EWalletTransactionType.TOPUP,
        balanceBefore,
        balanceAfter,
        description,
      });
      await queryRunner.manager.save(tx);

      await queryRunner.commitTransaction();

      return {
        success: true,
        paymentRequired: false,
        balance: balanceAfter,
        transaction: tx,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  buildVnpayPaymentUrl(txRef: string, totalAmount: number, ipAddr: string): string {
    const tmnCode = this.configService.get<string>(ENV_VARS.VNP_TMN_CODE) || 'TMDTDEV1';
    const secretKey = this.configService.get<string>(ENV_VARS.VNP_HASH_SECRET) || 'VNPAYSECRET';
    const vnpUrl = this.configService.get<string>(ENV_VARS.VNP_URL) || 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const appUrl = this.configService.get<string>(ENV_VARS.APP_PUBLIC_URL) || 'http://localhost:5173';
    const returnUrl = `${appUrl}/profile/wallet?topup=vnpay`;

    const date = new Date();
    const createDate =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, '0') +
      String(date.getDate()).padStart(2, '0') +
      String(date.getHours()).padStart(2, '0') +
      String(date.getMinutes()).padStart(2, '0') +
      String(date.getSeconds()).padStart(2, '0');

    const amount = Math.round(totalAmount * 100);

    const vnp_Params: any = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: txRef,
      vnp_OrderInfo: 'Nap tien vao vi dien tu ' + txRef,
      vnp_OrderType: 'other',
      vnp_Amount: amount,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: ipAddr || '127.0.0.1',
      vnp_CreateDate: createDate,
    };

    const sorted: any = {};
    for (const key of Object.keys(vnp_Params).sort()) {
      sorted[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+');
    }

    const signData = Object.keys(sorted)
      .map((key) => `${key}=${sorted[key]}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sorted['vnp_SecureHash'] = signed;

    const finalQuery = Object.keys(sorted)
      .map((key) => `${key}=${sorted[key]}`)
      .join('&');

    return `${vnpUrl}?${finalQuery}`;
  }

  verifyVnpaySignature(query: any): boolean {
    const secretKey = this.configService.get<string>(ENV_VARS.VNP_HASH_SECRET) || 'VNPAYSECRET';
    const vnp_Params = { ...query };
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sorted: any = {};
    for (const key of Object.keys(vnp_Params).sort()) {
      sorted[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, '+');
    }

    const signData = Object.keys(sorted)
      .map((key) => `${key}=${sorted[key]}`)
      .join('&');

    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    return signed === secureHash;
  }

  async deductBalance(
    userId: string,
    amount: number,
    orderId?: string,
    queryRunner?: QueryRunner,
  ): Promise<{ balanceBefore: number; balanceAfter: number }> {
    if (amount <= 0) return { balanceBefore: 0, balanceAfter: 0 };

    const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;

    const wallet = await manager
      .createQueryBuilder(Wallet, 'wallet')
      .setLock('pessimistic_write')
      .where('wallet.userId = :userId', { userId })
      .getOne();

    if (!wallet) {
      throw new BadRequestException('Không tìm thấy thông tin ví người dùng');
    }

    if (wallet.status === EWalletStatus.LOCKED) {
      throw new BadRequestException('Ví của bạn đang bị tạm khóa');
    }

    const balanceBefore = Number(wallet.balance);
    if (balanceBefore < amount) {
      throw new BadRequestException('Số dư không đủ, vui lòng tải lại trang');
    }

    const balanceAfter = balanceBefore - amount;
    wallet.balance = balanceAfter;
    await manager.save(wallet);

    const tx = manager.create(WalletTransaction, {
      walletId: wallet.id,
      orderId,
      amount: -amount,
      type: EWalletTransactionType.PAYMENT,
      balanceBefore,
      balanceAfter,
      description: orderId ? `Thanh toán cho đơn hàng #${orderId}` : 'Thanh toán đơn hàng',
    });
    await manager.save(tx);

    return { balanceBefore, balanceAfter };
  }

  async refundBalance(
    userId: string,
    amount: number,
    orderId?: string,
    queryRunner?: QueryRunner,
  ): Promise<{ balanceBefore: number; balanceAfter: number }> {
    if (amount <= 0) return { balanceBefore: 0, balanceAfter: 0 };

    let internalRunner: QueryRunner | null = null;
    let manager: EntityManager;

    if (queryRunner) {
      manager = queryRunner.manager;
    } else {
      internalRunner = this.dataSource.createQueryRunner();
      await internalRunner.connect();
      await internalRunner.startTransaction();
      manager = internalRunner.manager;
    }

    try {
      await this.getOrCreateWallet(userId, manager);

      const wallet = await manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write')
        .where('wallet.userId = :userId', { userId })
        .getOne();

      if (!wallet) throw new NotFoundException('Không tìm thấy thông tin ví');

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + Number(amount);

      wallet.balance = balanceAfter;
      await manager.save(wallet);

      const tx = manager.create(WalletTransaction, {
        walletId: wallet.id,
        orderId,
        amount: Number(amount),
        type: EWalletTransactionType.REFUND,
        balanceBefore,
        balanceAfter,
        description: orderId ? `Hoàn tiền từ đơn hàng #${orderId}` : 'Hoàn tiền đơn hàng',
      });
      await manager.save(tx);

      if (internalRunner) {
        await internalRunner.commitTransaction();
      }

      return { balanceBefore, balanceAfter };
    } catch (err) {
      if (internalRunner) {
        await internalRunner.rollbackTransaction();
      }
      throw err;
    } finally {
      if (internalRunner) {
        await internalRunner.release();
      }
    }
  }

  async refundOrder(
    order: { id: string; userId: string; walletDeductionAmount?: number },
    queryRunner?: QueryRunner,
  ): Promise<boolean> {
    const manager = queryRunner ? queryRunner.manager : this.dataSource.manager;

    const existingRefund = await manager.findOne(WalletTransaction, {
      where: { orderId: order.id, type: EWalletTransactionType.REFUND },
    });
    if (existingRefund) {
      return false;
    }

    let refundAmount = Number(order.walletDeductionAmount || 0);
    if (refundAmount <= 0) {
      const paymentTx = await manager.findOne(WalletTransaction, {
        where: { orderId: order.id, type: EWalletTransactionType.PAYMENT },
      });
      if (paymentTx) {
        refundAmount = Math.abs(Number(paymentTx.amount));
      }
    }

    if (refundAmount > 0) {
      await this.refundBalance(order.userId, refundAmount, order.id, queryRunner);
      return true;
    }

    return false;
  }

  // --- RÚT TIỀN (WITHDRAWALS - UC18) ---

  async createWithdrawal(userId: string, dto: CreateWithdrawalDto) {
    if (dto.amount < 10000) {
      throw new BadRequestException('Số tiền rút tối thiểu là 10.000 ₫');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write')
        .where('wallet.userId = :userId', { userId })
        .getOne();

      if (!wallet) throw new NotFoundException('Không tìm thấy thông tin ví');
      if (wallet.status === EWalletStatus.LOCKED) {
        throw new BadRequestException('Ví của bạn đang bị khóa, không thể rút tiền');
      }

      const balanceBefore = Number(wallet.balance);
      if (balanceBefore < dto.amount) {
        throw new BadRequestException('Số dư ví không đủ để thực hiện yêu cầu rút tiền');
      }

      const balanceAfter = balanceBefore - dto.amount;
      wallet.balance = balanceAfter;
      await queryRunner.manager.save(wallet);

      // Create transaction record
      const tx = queryRunner.manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount: -dto.amount,
        type: EWalletTransactionType.WITHDRAWAL,
        balanceBefore,
        balanceAfter,
        description: `Yêu cầu rút tiền về ${dto.bankName} - STK: ${dto.accountNumber} (${dto.accountHolder})`,
      });
      await queryRunner.manager.save(tx);

      // Create withdrawal request
      const withdrawal = queryRunner.manager.create(WalletWithdrawal, {
        walletId: wallet.id,
        userId,
        amount: dto.amount,
        bankName: dto.bankName,
        accountNumber: dto.accountNumber,
        accountHolder: dto.accountHolder,
        status: EWalletWithdrawalStatus.PENDING,
      });
      const savedWithdrawal = await queryRunner.manager.save(withdrawal);

      await queryRunner.commitTransaction();

      return {
        success: true,
        message: 'Gửi yêu cầu rút tiền thành công, vui lòng chờ bộ phận kế toán xử lý',
        data: savedWithdrawal,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserWithdrawals(userId: string) {
    const items = await this.withdrawalRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
    return items;
  }

  async getAdminWithdrawals(page = 1, limit = 20, status?: EWalletWithdrawalStatus) {
    const qb = this.withdrawalRepository.createQueryBuilder('w').leftJoinAndSelect('w.wallet', 'wallet');

    if (status) {
      qb.where('w.status = :status', { status });
    }

    const [items, total] = await qb
      .orderBy('w.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    // Ràng buộc UC18: Tính tổng số tiền của TẤT CẢ các yêu cầu rút tiền đang chờ duyệt (PENDING)
    const pendingSumResult = await this.withdrawalRepository
      .createQueryBuilder('w')
      .select('SUM(w.amount)', 'totalPending')
      .where('w.status = :status', { status: EWalletWithdrawalStatus.PENDING })
      .getRawOne();

    const totalPendingAmount = Number(pendingSumResult?.totalPending || 0);

    return {
      items,
      total,
      totalPendingAmount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async completeWithdrawal(id: string, processedBy: string, dto: CompleteWithdrawalDto) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
    if (!withdrawal) throw new NotFoundException('Không tìm thấy yêu cầu rút tiền');

    if (withdrawal.status !== EWalletWithdrawalStatus.PENDING) {
      throw new BadRequestException('Yêu cầu rút tiền này đã được xử lý trước đó');
    }

    withdrawal.status = EWalletWithdrawalStatus.COMPLETED;
    withdrawal.billProofUrl = dto.billProofUrl;
    withdrawal.adminNote = dto.adminNote || 'Đã chuyển khoản thành công';
    withdrawal.processedBy = processedBy;

    const saved = await this.withdrawalRepository.save(withdrawal);
    return saved;
  }

  async rejectWithdrawal(id: string, processedBy: string, dto: RejectWithdrawalDto) {
    const withdrawal = await this.withdrawalRepository.findOne({ where: { id } });
    if (!withdrawal) throw new NotFoundException('Không tìm thấy yêu cầu rút tiền');

    if (withdrawal.status !== EWalletWithdrawalStatus.PENDING) {
      throw new BadRequestException('Yêu cầu rút tiền này đã được xử lý trước đó');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const wallet = await queryRunner.manager
        .createQueryBuilder(Wallet, 'wallet')
        .setLock('pessimistic_write')
        .where('wallet.id = :id', { id: withdrawal.walletId })
        .getOne();

      if (!wallet) throw new NotFoundException('Không tìm thấy thông tin ví');

      const balanceBefore = Number(wallet.balance);
      const balanceAfter = balanceBefore + Number(withdrawal.amount);

      wallet.balance = balanceAfter;
      await queryRunner.manager.save(wallet);

      // Create refund transaction
      const tx = queryRunner.manager.create(WalletTransaction, {
        walletId: wallet.id,
        amount: Number(withdrawal.amount),
        type: EWalletTransactionType.WITHDRAWAL_REFUND,
        balanceBefore,
        balanceAfter,
        description: `Hoàn tiền yêu cầu rút tiền bị từ chối: ${dto.reason}`,
      });
      await queryRunner.manager.save(tx);

      withdrawal.status = EWalletWithdrawalStatus.REJECTED;
      withdrawal.adminNote = dto.reason;
      withdrawal.processedBy = processedBy;
      const savedWithdrawal = await queryRunner.manager.save(withdrawal);

      await queryRunner.commitTransaction();

      return savedWithdrawal;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await this.getOrCreateWallet(userId);
    const [items, total] = await this.transactionRepository.findAndCount({
      where: { walletId: wallet.id },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items: items.map((i) => ({
        id: i.id,
        orderId: i.orderId,
        amount: Number(i.amount),
        type: i.type,
        balanceBefore: Number(i.balanceBefore),
        balanceAfter: Number(i.balanceAfter),
        description: i.description,
        createdAt: i.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
