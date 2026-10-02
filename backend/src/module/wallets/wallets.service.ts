import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, EntityManager } from 'typeorm';
import { Wallet } from './entities/wallet.entity';
import { WalletTransaction } from './entities/wallet-transaction.entity';
import { EWalletStatus, EWalletTransactionType } from './enums/wallet.enum';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepository: Repository<WalletTransaction>,
    private readonly dataSource: DataSource,
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

  // ponytail: Direct balance credit for testing/demo top-up; upgrade to payment gateway IPN when production banking is integrated.
  async topup(userId: string, amount: number, description = 'Nạp tiền vào ví điện tử') {
    if (amount <= 0) {
      throw new BadRequestException('Số tiền nạp phải lớn hơn 0');
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
