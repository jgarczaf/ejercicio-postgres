import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  VIEWER = 'VIEWER',
  OPERATOR = 'OPERATOR',
}

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: UserRole;

  @Column('text', { array: true, default: '{}' })
  permissions: string[];

  @Column()
  balance: number;

  @Column()
  lastLogin: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
