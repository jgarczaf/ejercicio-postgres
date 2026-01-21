import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import * as session from 'express-session';
import { AppModule } from './../src/app.module';

describe('Transacciones API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Configurar middleware de sesión
    app.use(
      session({
        secret: 'test-secret-key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
      }),
    );

    // Configurar validación global
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('GET /health - Debería retornar estado OK', () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('OK');
          expect(res.body.message).toContain('Transacciones Bancarias');
        });
    });
  });

  describe('CRUD de Transacciones', () => {
    let transactionId: number;

    it('POST /transactions - Crear una transacción', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          concept: 'Nómina Enero',
          category: 'Ingresos',
          amount: 2500.0,
          date: '2024-01-17',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.statusCode).toBe(201);
          expect(res.body.data.concept).toBe('Nómina Enero');
          expect(res.body.data.amount).toBe(2500.0);
          transactionId = res.body.data.id;
        });
    });

    it('GET /transactions - Obtener transacciones con paginación', () => {
      return request(app.getHttpServer())
        .get('/transactions?page=1&limit=10')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('data');
          expect(res.body).toHaveProperty('pagination');
          expect(res.body.pagination.page).toBe(1);
          expect(res.body.pagination.limit).toBe(10);
        });
    });

    it('GET /transactions/:id - Obtener transacción específica', () => {
      return request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.data.id).toBe(transactionId);
        });
    });

    it('PUT /transactions/:id - Actualizar totalmente transacción', () => {
      return request(app.getHttpServer())
        .put(`/transactions/${transactionId}`)
        .send({
          concept: 'Nómina Actualizada',
          category: 'Ingresos',
          amount: 2600.0,
          date: '2024-01-18',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.concept).toBe('Nómina Actualizada');
          expect(res.body.data.amount).toBe(2600.0);
        });
    });

    it('PATCH /transactions/:id - Actualizar parcialmente transacción', () => {
      return request(app.getHttpServer())
        .patch(`/transactions/${transactionId}`)
        .send({
          amount: 2700.0,
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.amount).toBe(2700.0);
          expect(res.body.data.concept).toBe('Nómina Actualizada');
        });
    });

    it('DELETE /transactions/:id - Eliminar transacción', () => {
      return request(app.getHttpServer())
        .delete(`/transactions/${transactionId}`)
        .expect(204);
    });

    it('GET /transactions/:id - Debería retornar 404 después de eliminar', () => {
      return request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(404);
    });
  });

  describe('Validaciones', () => {
    it('POST /transactions - Debería rechazar amount negativo', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          concept: 'Transacción Inválida',
          category: 'Test',
          amount: -100,
          date: '2024-01-17',
        })
        .expect(400);
    });

    it('POST /transactions - Debería rechazar fecha inválida', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          concept: 'Transacción Inválida',
          category: 'Test',
          amount: 100,
          date: 'fecha-invalida',
        })
        .expect(400);
    });

    it('POST /transactions - Debería rechazar campos faltantes', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          concept: 'Transacción Incompleta',
          category: 'Test',
        })
        .expect(400);
    });
  });
});
