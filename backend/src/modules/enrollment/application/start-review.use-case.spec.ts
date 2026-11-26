import { jest } from '@jest/globals';
import {
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { StartReviewUseCase } from './start-review.use-case.js';

describe('StartReviewUseCase', () => {
  let useCase: StartReviewUseCase;
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

    useCase = new StartReviewUseCase(prismaMock);
  });

  it('debe impedir el inicio de revisión si la solicitud no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', 'admin-test-id'),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir el inicio de revisión si la solicitud no está PENDIENTE', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'EN_REVISION',
    });

    await expect(
      useCase.execute('request-test-id', 'admin-test-id'),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir el inicio si la solicitud cambia de estado durante la operación', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'PENDIENTE',
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 0,
    });

    await expect(
      useCase.execute('request-test-id', 'admin-test-id'),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe iniciar la revisión y registrar al administrador en el historial', async () => {
    const reviewMock = {
      id: 'review-test-id',
      action: 'REVISION_INICIADA',
      comment: 'Se inició la revisión de la solicitud.',
    };

    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      status: 'PENDIENTE',
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.requestReview.create.mockResolvedValue(reviewMock);

    const result = await useCase.execute(
      'request-test-id',
      'admin-test-id',
    );

    expect(result).toEqual({
      requestId: 'request-test-id',
      previousStatus: 'PENDIENTE',
      currentStatus: 'EN_REVISION',
      review: reviewMock,
    });

    expect(prismaMock.requestReview.create).toHaveBeenCalledWith({
      data: {
        requestId: 'request-test-id',
        actorUserId: 'admin-test-id',
        action: 'REVISION_INICIADA',
        comment: 'Se inició la revisión de la solicitud.',
      },
    });
  });
});
