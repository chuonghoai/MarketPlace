import { InternalServerErrorException } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { Wallet } from './entities/wallet.entity';
import { EWalletStatus } from './enums/wallet.enum';

describe('WalletsService.getOrCreateWallet', () => {
  const existingWallet = {
    id: 'wallet-1',
    userId: 'user-1',
    balance: 0,
    status: EWalletStatus.ACTIVE,
  } as Wallet;
  const queryBuilder = {
    insert: jest.fn(),
    into: jest.fn(),
    values: jest.fn(),
    orIgnore: jest.fn(),
    execute: jest.fn(),
  };
  const walletRepository = {
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
  const service = new WalletsService(
    walletRepository as any,
    {} as any,
    {} as any,
    {} as any,
    {} as any,
  );

  beforeEach(() => {
    jest.resetAllMocks();
    queryBuilder.insert.mockReturnValue(queryBuilder);
    queryBuilder.into.mockReturnValue(queryBuilder);
    queryBuilder.values.mockReturnValue(queryBuilder);
    queryBuilder.orIgnore.mockReturnValue(queryBuilder);
    walletRepository.createQueryBuilder.mockReturnValue(queryBuilder);
  });

  it('returns an existing wallet without inserting', async () => {
    walletRepository.findOne.mockResolvedValue(existingWallet);

    await expect(service.getOrCreateWallet('user-1')).resolves.toBe(existingWallet);
    expect(walletRepository.createQueryBuilder).not.toHaveBeenCalled();
  });

  it('atomically inserts a missing wallet without overwriting an existing one', async () => {
    walletRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(existingWallet);
    queryBuilder.execute.mockResolvedValue({});

    await expect(service.getOrCreateWallet('user-1')).resolves.toBe(existingWallet);
    expect(queryBuilder.values).toHaveBeenCalledWith({
      userId: 'user-1',
      balance: 0,
      status: EWalletStatus.ACTIVE,
    });
    expect(queryBuilder.orIgnore).toHaveBeenCalled();
  });

  it('does not hide database failures during initialization', async () => {
    const error = new Error('database unavailable');
    walletRepository.findOne.mockResolvedValue(null);
    queryBuilder.execute.mockRejectedValue(error);

    await expect(service.getOrCreateWallet('user-1')).rejects.toBe(error);
  });

  it('fails clearly if the wallet cannot be read after insertion', async () => {
    walletRepository.findOne.mockResolvedValue(null);
    queryBuilder.execute.mockResolvedValue({});

    await expect(service.getOrCreateWallet('user-1')).rejects.toBeInstanceOf(InternalServerErrorException);
  });
});

describe('WalletsService.verifyVnpaySignature', () => {
  const secretKey = 'MY_VNPAY_SECRET';
  const configService = {
    get: jest.fn().mockImplementation((key: string) => {
      if (key === 'VNP_HASH_SECRET') return secretKey;
      return null;
    }),
  };
  const service = new WalletsService(
    {} as any,
    {} as any,
    {} as any,
    {} as any,
    configService as any,
  );

  beforeEach(() => {
    configService.get.mockReturnValue(secretKey);
  });

  it('validates signature correctly even when extraneous parameters like topup are present', () => {
    const crypto = require('crypto');
    const vnpParams: Record<string, string> = {
      vnp_Amount: '10000000',
      vnp_BankCode: 'NCB',
      vnp_ResponseCode: '00',
      vnp_TxnRef: 'TOPUP_123',
    };
    const signData = Object.keys(vnpParams)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(vnpParams[k]).replace(/%20/g, '+')}`)
      .join('&');
    const hash = crypto.createHmac('sha512', secretKey).update(signData).digest('hex');

    const queryWithExtra = {
      ...vnpParams,
      topup: 'vnpay',
      other_param: 'test',
      vnp_SecureHash: hash.toUpperCase(), // Test case-insensitive
    };

    expect(service.verifyVnpaySignature(queryWithExtra)).toBe(true);
  });

  it('returns false when signature does not match or is missing', () => {
    expect(service.verifyVnpaySignature({})).toBe(false);
    expect(
      service.verifyVnpaySignature({
        vnp_Amount: '10000000',
        vnp_SecureHash: 'invalid_hash',
      }),
    ).toBe(false);
  });
});