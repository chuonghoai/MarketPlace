import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { EWalletStatus } from '../enums/wallet.enum';
import { WalletTransaction } from './wallet-transaction.entity';

@Entity('wallets')
export class Wallet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  balance: number;

  @Column({ type: 'enum', enum: EWalletStatus, default: EWalletStatus.ACTIVE })
  status: EWalletStatus;

  @OneToMany(() => WalletTransaction, (tx) => tx.wallet)
  transactions: WalletTransaction[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
