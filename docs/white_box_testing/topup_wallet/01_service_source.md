# 01. Source Code `topup`

File gốc: `backend/src/module/wallets/wallets.service.ts`  
Hàm: `topup`

```typescript
async topup(
  userId: string,
  amount: number,
  paymentMethod: 'DIRECT' | 'VNPAY' | 'MOMO' | 'PAYPAL' = 'DIRECT',
  ipAddr = '127.0.0.1',
  description = 'Nạp tiền vào ví điện tử',
) { // [1]
  if (!amount /* [2] */ || amount < 10000 /* [3] */) {
    throw new BadRequestException('Số tiền nạp tối thiểu là 10.000 ₫'); // [4]
  }

  if (paymentMethod === 'VNPAY') { // [5]
    const txRef = `TOPUP_${Date.now()}_${userId.slice(0, 8)}`; // [6]
    const paymentUrl = this.buildVnpayPaymentUrl(txRef, amount, ipAddr); // [7]
    return { // [8]
      paymentRequired: true,
      paymentUrl,
      txRef,
      amount,
    };
  }

  if (paymentMethod === 'MOMO') { // [9]
    const txRef = `TOPUP_MOMO_${Date.now()}_${userId.slice(0, 8)}`; // [10]
    const paymentUrl = await this.buildMomoPaymentUrl(txRef, amount); // [11]
    return { // [12]
      paymentRequired: true,
      paymentUrl,
      txRef,
      amount,
    };
  }

  if (paymentMethod === 'PAYPAL') { // [13]
    const txRef = `TOPUP_PAYPAL_${Date.now()}_${userId.slice(0, 8)}`; // [14]
    const paymentUrl = await this.buildPaypalPaymentUrl(txRef, amount); // [15]
    return { // [16]
      paymentRequired: true,
      paymentUrl,
      txRef,
      amount,
    };
  }

  const queryRunner = this.dataSource.createQueryRunner(); // [17]
  await queryRunner.connect(); // [18]
  await queryRunner.startTransaction(); // [19]

  try {
    await this.getOrCreateWallet(userId, queryRunner.manager); // [20]

    const wallet = await queryRunner.manager // [21]
      .createQueryBuilder(Wallet, 'wallet')
      .setLock('pessimistic_write')
      .where('wallet.userId = :userId', { userId })
      .getOne();

    if (!wallet) throw new NotFoundException('Không tìm thấy thông tin ví'); // [22] (if), [23] (throw)
    if (wallet.status === EWalletStatus.LOCKED) { // [24]
      throw new BadRequestException('Ví của bạn đang bị tạm khóa'); // [25]
    }

    const balanceBefore = Number(wallet.balance); // [26]
    const balanceAfter = balanceBefore + Number(amount); // [27]

    wallet.balance = balanceAfter; // [28]
    await queryRunner.manager.save(wallet); // [29]

    const tx = queryRunner.manager.create(WalletTransaction, { // [30]
      walletId: wallet.id,
      amount: Number(amount),
      type: EWalletTransactionType.TOPUP,
      balanceBefore,
      balanceAfter,
      description,
    });
    await queryRunner.manager.save(tx); // [31]

    await queryRunner.commitTransaction(); // [32]

    return { // [33]
      success: true,
      paymentRequired: false,
      balance: balanceAfter,
      transaction: tx,
    };
  } catch (err) { // [34]
    await queryRunner.rollbackTransaction(); // [35]
    throw err; // [36]
  } finally {
    await queryRunner.release(); // [37]
  }
}
```
