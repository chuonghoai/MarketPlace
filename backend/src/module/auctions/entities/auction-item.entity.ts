import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Auction } from './auction.entity';
import { AuctionStatus } from '../enums/auction.enum';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';

@Entity('auction_items')
export class AuctionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Auction, (auction) => auction.items, { onDelete: 'CASCADE' })
  auction: Auction;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @Column('bigint')
  startPrice: number;

  @Column('bigint', { nullable: true })
  currentPrice: number;

  @ManyToOne(() => User, { nullable: true })
  currentWinner: User;

  @Column({ type: 'enum', enum: AuctionStatus, default: AuctionStatus.PENDING })
  status: AuctionStatus;
}
