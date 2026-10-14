import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AuctionItem } from './auction-item.entity';
import { AuctionStatus } from '../enums/auction.enum';

@Entity('auctions')
export class Auction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'datetime' })
  startTime: Date;

  @Column({ type: 'datetime' })
  endTime: Date;

  @Column({ default: 30 })
  countdownDuration: number; // seconds

  @Column('bigint', { default: 1000 })
  minStepPrice: number;

  @Column({ type: 'enum', enum: AuctionStatus, default: AuctionStatus.PENDING })
  status: AuctionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => AuctionItem, (item) => item.auction, { cascade: true })
  items: AuctionItem[];
}
