import { IsString, IsNumber, IsOptional, IsEnum, IsPositive } from 'class-validator';
import { TransactionType, TransactionStatus } from '../entities/transaction.entity';

export class UpdateTransactionDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  amount?: number;

  @IsEnum(TransactionStatus)
  @IsOptional()
  status?: TransactionStatus;
}
