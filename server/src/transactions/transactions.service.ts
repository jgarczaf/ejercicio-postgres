import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction, TransactionStatus } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  /**
   * Crear una nueva transacción
   * Sincroniza el balance del usuario después de crear
   */
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = this.transactionRepository.create({
      ...createTransactionDto,
      status: TransactionStatus.PENDING,
    });

    const saved = await this.transactionRepository.save(transaction);

    return saved;
  }

  /**
   * Obtener todas las transacciones con paginación
   */
  async findAll(page = 1, limit = 10) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.transactionRepository.findAndCount({
      skip,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Obtener transacciones filtradas por userId con paginación
   */
  async findByUser(userId: string, page = 1, limit = 10) {
    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Math.min(100, Number(limit) || 10));
    const skip = (safePage - 1) * safeLimit;

    const [data, total] = await this.transactionRepository.findAndCount({
      where: { userId },
      skip,
      take: safeLimit,
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  /**
   * Obtener una transacción por ID
   */
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({ where: { id } as any });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  /**
   * Actualizar una transacción existente
   */

  async update(id: string, dto: UpdateTransactionDto): Promise<Transaction> {
    const existing = await this.transactionRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    const merged = this.transactionRepository.merge(existing, dto);
    return this.transactionRepository.save(merged);
  }

  /**
   * Eliminar una transacción
   * Sincroniza el balance del usuario después de eliminar
   */
  async remove(id: string): Promise<{ message: string }> {
    const existing = await this.transactionRepository.findOne({ where: { id } as any });
    if (!existing) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }

    await this.transactionRepository.remove(existing);

    return { message: `Transaction ${id} has been deleted` };
  }

  /**
   * Sincronizar el balance del usuario
   * Calcula el nuevo balance basado en transacciones completadas
   */
  async syncUserBalance(userId: string): Promise<void> {
    try {
      const { sum } = await this.transactionRepository
        .createQueryBuilder('t')
        .select('COALESCE(SUM(t.amount), 0)', 'sum')
        .where('t.userId = :userId', { userId })
        .andWhere('t.status = :status', { status: TransactionStatus.COMPLETED })
        .getRawOne<{ sum: string | number }>();

      const totalBalance = Number(sum) || 0;

      await this.userRepository.update(userId as any, { balance: totalBalance });
    } catch (error) {
      // Loguear pero no romper la operación principal
      console.error(`Error syncing balance for user ${userId}:`, error);
    }
  }
}
