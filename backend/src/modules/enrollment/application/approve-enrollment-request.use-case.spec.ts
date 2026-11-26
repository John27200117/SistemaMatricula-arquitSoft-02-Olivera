
import { jest } from '@jest/globals';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ApproveEnrollmentRequestUseCase } from './approve-enrollment-request.use-case.js';

describe('ApproveEnrollmentRequestUseCase', () => {
  let useCase: ApproveEnrollmentRequestUseCase;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      enrollmentRequest: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      vacancy: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      enrollment: {
        create: jest.fn(),
      },
      requestReview: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(prismaMock),
    );

    useCase = new ApproveEnrollmentRequestUseCase(prismaMock);
  });

  it('debe impedir la aprobación si la solicitud no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.vacancy.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
  });

  it('debe impedir la aprobación si la solicitud no está EN_REVISION', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'PENDIENTE',
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.vacancy.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
  });

  it('debe impedir la aprobación si la vacante no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.vacancy.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
  });

  it('debe impedir la aprobación si la vacante está llena', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.vacancy.findUnique.mockResolvedValue({
      id: 'vacancy-test-id',
      capacity: 30,
      occupiedCount: 30,
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
  });

  it('debe impedir la aprobación si la solicitud cambia de estado durante la operación', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.vacancy.findUnique.mockResolvedValue({
      id: 'vacancy-test-id',
      capacity: 30,
      occupiedCount: 10,
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 0,
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.vacancy.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
  });

  it('debe impedir la aprobación si cambia la disponibilidad de la vacante', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.vacancy.findUnique.mockResolvedValue({
      id: 'vacancy-test-id',
      capacity: 30,
      occupiedCount: 29,
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.vacancy.updateMany.mockResolvedValue({
      count: 0,
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollment.create).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe aprobar la solicitud y registrar la matrícula', async () => {
    const enrollmentMock = {
      id: 'enrollment-test-id',
      requestId: 'request-test-id',
    };

    const reviewMock = {
      id: 'review-test-id',
      action: 'APROBADA',
    };

    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      periodId: 'period-test-id',
      vacancyId: 'vacancy-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.vacancy.findUnique.mockResolvedValue({
      id: 'vacancy-test-id',
      capacity: 30,
      occupiedCount: 10,
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.vacancy.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.enrollment.create.mockResolvedValue(enrollmentMock);
    prismaMock.requestReview.create.mockResolvedValue(reviewMock);

    const result = await useCase.execute('request-test-id', {
      actorUserId: 'admin-test-id',
    });

    expect(result.currentStatus).toBe('APROBADA');
    expect(result.enrollment).toEqual(enrollmentMock);
    expect(result.vacancy.currentOccupiedCount).toBe(11);
    expect(result.review).toEqual(reviewMock);

    expect(prismaMock.enrollmentRequest.updateMany).toHaveBeenCalled();
    expect(prismaMock.vacancy.updateMany).toHaveBeenCalled();
    expect(prismaMock.enrollment.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-test-id',
        studentId: 'student-test-id',
        periodId: 'period-test-id',
        vacancyId: 'vacancy-test-id',
        approvedAt: expect.any(Date),
      },
    });

    expect(prismaMock.requestReview.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-test-id',
        actorUserId: 'admin-test-id',
        action: 'APROBADA',
        comment: 'La solicitud fue aprobada y se registró la matrícula.',
      },
    });
  });
});
