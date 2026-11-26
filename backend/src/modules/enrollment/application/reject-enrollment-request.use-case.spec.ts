
import { jest } from '@jest/globals';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RejectEnrollmentRequestUseCase } from './reject-enrollment-request.use-case.js';

describe('RejectEnrollmentRequestUseCase', () => {
  let useCase: RejectEnrollmentRequestUseCase;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      enrollmentRequest: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      requestReview: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(prismaMock),
    );

    useCase = new RejectEnrollmentRequestUseCase(prismaMock);
  });

  it('debe impedir el rechazo si la solicitud no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
        comment: 'Motivo de prueba del rechazo.',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe rechazar una solicitud cuando está en EN_REVISION', async () => {
    const reviewMock = {
      id: 'review-test-id',
      action: 'RECHAZADA',
      comment: 'Documentación incompleta.',
    };

    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.requestReview.create.mockResolvedValue(reviewMock);

    const result = await useCase.execute('request-test-id', {
      actorUserId: 'admin-test-id',
      comment: 'Documentación incompleta.',
    });

    expect(result).toEqual({
      requestId: 'request-test-id',
      previousStatus: 'EN_REVISION',
      currentStatus: 'RECHAZADA',
      review: reviewMock,
    });

    expect(prismaMock.enrollmentRequest.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'request-test-id',
        status: 'EN_REVISION',
      },
      data: {
        status: 'RECHAZADA',
      },
    });

    expect(prismaMock.requestReview.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-test-id',
        actorUserId: 'admin-test-id',
        action: 'RECHAZADA',
        comment: 'Documentación incompleta.',
      },
    });
  });

  it('debe impedir el rechazo si la solicitud no está en EN_REVISION', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'PENDIENTE',
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
        comment: 'Motivo de prueba del rechazo.',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir el rechazo si la solicitud cambia de estado durante la operación', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'EN_REVISION',
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 0,
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
        comment: 'Motivo de prueba del rechazo.',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });
});
