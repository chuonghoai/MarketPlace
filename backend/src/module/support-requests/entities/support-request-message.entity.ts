import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { SupportRequest } from './support-request.entity';

@Entity('support_request_messages')
export class SupportRequestMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'requestId' })
  requestId: string;

  @ManyToOne(() => SupportRequest, (req) => req.messages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'requestId' })
  request: SupportRequest;

  @Column({ name: 'senderId' })
  senderId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
