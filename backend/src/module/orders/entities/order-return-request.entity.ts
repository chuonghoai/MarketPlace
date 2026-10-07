import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../checkout/entities/order.entity';
import { EOrderReturnType, EOrderReturnStatus } from '../enums/order-return.enum';

@Entity('order_returns')
export class OrderReturnRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  orderId: string;

  @ManyToOne(() => Order, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column()
  userId: string;

  @Column({ type: 'enum', enum: EOrderReturnType })
  type: EOrderReturnType;

  @Column()
  title: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'simple-array', nullable: true })
  proofImages: string[];

  @Column({ type: 'simple-array', nullable: true })
  proofVideos: string[];

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  bankAccountNumber: string;

  @Column({ nullable: true })
  bankAccountHolder: string;

  @Column({ nullable: true })
  refundProofUrl: string;

  @Column({ type: 'enum', enum: EOrderReturnStatus, default: EOrderReturnStatus.PENDING })
  status: EOrderReturnStatus;

  @Column({ nullable: true })
  newOrderId: string;

  @Column({ type: 'text', nullable: true })
  adminNote: string;

  @Column({ nullable: true })
  processedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
