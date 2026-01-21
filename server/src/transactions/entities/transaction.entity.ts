import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TransactionType {
  TRANSFER = 'transfer',
  PAYMENT = 'payment',
  DIRECT_DEBIT = 'direct_debit',
  INVESTMENT = 'investment',
}

export enum TransactionStatus {
  COMPLETED = 'completed',
  PENDING = 'pending',
  PROCESSING = 'processing',
  FAILED = 'failed',
}

@Entity('transaction')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: TransactionStatus })
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType })
  type: TransactionType;

  @Column()
  amount: number;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
