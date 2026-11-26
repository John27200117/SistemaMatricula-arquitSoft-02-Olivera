
import { jest } from '@jest/globals';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { ObserveEnrollmentRequestUseCase } from './observe-enrollment-request.use-case.js';

describe('ObserveEnrollmentRequestUseCase', () => {
  let useCase: ObserveEnrollmentRequestUseCase;
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

    useCase = new ObserveEnrollmentRequestUseCase(prismaMock);
  });

  it('debe impedir la observación si la solicitud no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
        comment: 'Documentación incompleta.',
      }),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir la observación si la solicitud no está EN_REVISION', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'PENDIENTE',
    });

    await expect(
      useCase.execute('request-test-id', {
        actorUserId: 'admin-test-id',
        comment: 'Documentación incompleta.',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir la observación si la solicitud cambia de estado durante la operación', async () => {
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
        comment: 'Documentación incompleta.',
      }),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe observar la solicitud y registrar al administrador y el comentario', async () => {
    const reviewMock = {
      id: 'review-test-id',
      action: 'OBSERVADA',
      comment: 'Falta presentar la partida de nacimiento.',
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
      comment: 'Falta presentar la partida de nacimiento.',
    });

    expect(result).toEqual({
      requestId: 'request-test-id',
      previousStatus: 'EN_REVISION',
      currentStatus: 'OBSERVADA',
      review: reviewMock,
    });

    expect(prismaMock.enrollmentRequest.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'request-test-id',
        status: 'EN_REVISION',
      },
      data: {
        status: 'OBSERVADA',
      },
    });

    expect(prismaMock.requestReview.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-test-id',
        actorUserId: 'admin-test-id',
        action: 'OBSERVADA',
        comment: 'Falta presentar la partida de nacimiento.',
      },
    });
  });
});
