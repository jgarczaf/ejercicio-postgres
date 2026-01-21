import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /**
   * GET /transactions - Obtener todas las transacciones con paginación
   */
  @Get()
  async findAll(
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10
  ) {
    return this.transactionsService.findAll(page, limit);
  }

  /**
   * GET /transactions/user/:userId - Obtener transacciones de un usuario específico
   */
  @Get('user/:userId')
  async findByUser(
    @Param('userId') userId: string,
    @Query('page', new ParseIntPipe()) page = 1,
    @Query('limit', new ParseIntPipe()) limit = 10
  ) {
    return this.transactionsService.findByUser(userId, page, limit);
  }

  /**
   * GET /transactions/:id - Obtener una transacción por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.findOne(id);
  }

  /**
   * POST /transactions - Crear una nueva transacción
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }

  /**
   * PATCH /transactions/:id - Actualizar una transacción
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTransactionDto: UpdateTransactionDto) {
    return this.transactionsService.update(id, updateTransactionDto);
  }

  /**
   * DELETE /transactions/:id - Eliminar una transacción
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
