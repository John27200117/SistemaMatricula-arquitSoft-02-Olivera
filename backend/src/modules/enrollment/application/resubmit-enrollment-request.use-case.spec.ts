
import { jest } from '@jest/globals';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ResubmitEnrollmentRequestUseCase } from './resubmit-enrollment-request.use-case.js';

describe('ResubmitEnrollmentRequestUseCase', () => {
  let useCase: ResubmitEnrollmentRequestUseCase;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      enrollmentRequest: {
        findUnique: jest.fn(),
        updateMany: jest.fn(),
      },
      guardianStudent: {
        findUnique: jest.fn(),
      },
      requestReview: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(prismaMock),
    );

    useCase = new ResubmitEnrollmentRequestUseCase(prismaMock);
  });

  it('debe impedir la subsanación si la solicitud no existe', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', 'guardian-test-id'),
    ).rejects.toThrow(NotFoundException);

    expect(prismaMock.guardianStudent.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir la subsanación si el apoderado no está vinculado al estudiante', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      status: 'OBSERVADA',
    });

    prismaMock.guardianStudent.findUnique.mockResolvedValue(null);

    await expect(
      useCase.execute('request-test-id', 'guardian-test-id'),
    ).rejects.toThrow(ForbiddenException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe impedir la subsanación si la solicitud no está OBSERVADA', async () => {
    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      status: 'PENDIENTE',
    });

    prismaMock.guardianStudent.findUnique.mockResolvedValue({
      guardianUserId: 'guardian-test-id',
      studentId: 'student-test-id',
    });

    await expect(
      useCase.execute('request-test-id', 'guardian-test-id'),
    ).rejects.toThrow(ConflictException);

    expect(prismaMock.enrollmentRequest.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.requestReview.create).not.toHaveBeenCalled();
  });

  it('debe subsanar la solicitud y registrar la acción en el historial', async () => {
    const reviewMock = {
      id: 'review-test-id',
      action: 'SUBSANADA',
      comment: 'El apoderado volvió a presentar la solicitud.',
    };

    prismaMock.enrollmentRequest.findUnique.mockResolvedValue({
      id: 'request-test-id',
      studentId: 'student-test-id',
      status: 'OBSERVADA',
    });

    prismaMock.guardianStudent.findUnique.mockResolvedValue({
      guardianUserId: 'guardian-test-id',
      studentId: 'student-test-id',
    });

    prismaMock.enrollmentRequest.updateMany.mockResolvedValue({
      count: 1,
    });

    prismaMock.requestReview.create.mockResolvedValue(reviewMock);

    const result = await useCase.execute('request-test-id','guardian-test-id');

    expect(result).toEqual({
      requestId: 'request-test-id',
      previousStatus: 'OBSERVADA',
      currentStatus: 'PENDIENTE',
      review: reviewMock,
    });

    expect(prismaMock.enrollmentRequest.updateMany).toHaveBeenCalled();
    expect(prismaMock.requestReview.create).toHaveBeenCalled();
  });
});
