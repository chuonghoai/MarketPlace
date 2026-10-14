import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Wallet } from './wallet.entity';
import { EWalletWithdrawalStatus } from '../enums/wallet.enum';

@Entity('wallet_withdrawals')
export class WalletWithdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  walletId: string;

  @ManyToOne(() => Wallet, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'walletId' })
  wallet: Wallet;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column()
  bankName: string;

  @Column()
  accountNumber: string;

  @Column()
  accountHolder: string;

  @Column({
    type: 'enum',
    enum: EWalletWithdrawalStatus,
    default: EWalletWithdrawalStatus.PENDING,
  })
  status: EWalletWithdrawalStatus;

  @Column({ type: 'text', nullable: true })
  billProofUrl: string;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @Column({ nullable: true })
  processedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
