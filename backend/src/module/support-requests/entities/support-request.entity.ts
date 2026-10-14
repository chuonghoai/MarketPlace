import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Staff } from '../../staffs/entities/staff.entity';
import { ESupportRequestStatus } from '../enums/support-request-status.enum';
import { SupportRequestMessage } from './support-request-message.entity';

@Entity('support_requests')
@Index(['assignedStaffId', 'status'])
@Index(['assignedStaffId', 'resolvedAt'])
export class SupportRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({
    type: 'enum',
    enum: ESupportRequestStatus,
    default: ESupportRequestStatus.OPEN,
  })
  status: ESupportRequestStatus;

  @Column({ name: 'requesterId' })
  requesterId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requesterId' })
  requester: User;

  @Index()
  @Column({ name: 'assignedStaffId', nullable: true })
  assignedStaffId: string | null;

  @ManyToOne(() => Staff, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'assignedStaffId' })
  assignedStaff: Staff | null;

  @Index()
  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'datetime', nullable: true })
  assignedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  firstResponseAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  resolvedAt: Date | null;

  @Column({ type: 'datetime', nullable: true })
  closedAt: Date | null;

  @OneToMany(
    () => SupportRequestMessage,
    (msg: SupportRequestMessage) => msg.request,
    { cascade: true },
  )
  messages: SupportRequestMessage[];
}
