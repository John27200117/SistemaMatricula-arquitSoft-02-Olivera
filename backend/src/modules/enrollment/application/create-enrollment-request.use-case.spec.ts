
import { jest } from '@jest/globals';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentRequestUseCase } from './create-enrollment-request.use-case.js';

describe('CreateEnrollmentRequestUseCase', () => {
  let useCase: CreateEnrollmentRequestUseCase;
  let prismaMock: any;

  const submittedByUserId = 'guardian-test-id';

  const dto = {
    studentId: 'student-test-id',
    enrollmentTypeId: 'type-test-id',
    vacancyId: 'vacancy-test-id',
  };

  const vacancyMock = {
    id: 'vacancy-test-id',
    periodId: 'period-test-id',
    capacity: 30,
    occupiedCount: 0,
  };

  const enrollmentTypeMock = {
    id: 'type-test-id',
    isActive: true,
  };

  beforeEach(() => {
    prismaMock = {
      guardianStudent: {
        findUnique: jest.fn(),
      },
      enrollmentType: {
        findUnique: jest.fn(),
      },
      vacancy: {
        findUnique: jest.fn(),
      },
      enrollment: {
        findFirst: jest.fn(),
      },
      enrollmentRequest: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
      requirementSet: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    prismaMock.$transaction.mockImplementation(
      async (callback: any) => callback(prismaMock),
    );

    useCase = new CreateEnrollmentRequestUseCase(prismaMock);
  });

  function configureValidRequest() {
    prismaMock.guardianStudent.findUnique.mockResolvedValue({
      guardianUserId: submittedByUserId,
      studentId: dto.studentId,
    });

    prismaMock.enrollmentType.findUnique.mockResolvedValue(
      enrollmentTypeMock,
    );

    prismaMock.vacancy.findUnique.mockResolvedValue(vacancyMock);

    prismaMock.enrollment.findFirst.mockResolvedValue(null);

    prismaMock.enrollmentRequest.findFirst.mockResolvedValue(null);

    prismaMock.requirementSet.findFirst.mockResolvedValue({
      id: 'requirement-set-test-id',
    });

    prismaMock.enrollmentRequest.create.mockResolvedValue({
      id: 'request-test-id',
      studentId: dto.studentId,
      submittedByUserId: submittedByUserId,
      vacancyId: vacancyMock.id,
      periodId: vacancyMock.periodId,
      requirementSetId: 'requirement-set-test-id',
      status: 'PENDIENTE',
      createdAt: new Date('2026-11-26T10:00:00.000Z'),
    });
  }

  it('debe rechazar la solicitud si el apoderado no está vinculado al estudiante', async () => {
    prismaMock.guardianStudent.findUnique.mockResolvedValue(null);

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      ForbiddenException,
    );

    expect(prismaMock.enrollmentType.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud si el tipo de matrícula no existe o está inactivo', async () => {
    prismaMock.guardianStudent.findUnique.mockResolvedValue({
      guardianUserId: submittedByUserId,
      studentId: dto.studentId,
    });

    prismaMock.enrollmentType.findUnique.mockResolvedValue({
      id: dto.enrollmentTypeId,
      isActive: false,
    });

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      BadRequestException,
    );

    expect(prismaMock.vacancy.findUnique).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud si la vacante no existe', async () => {
    prismaMock.guardianStudent.findUnique.mockResolvedValue({
      guardianUserId: submittedByUserId,
      studentId: dto.studentId,
    });

    prismaMock.enrollmentType.findUnique.mockResolvedValue(
      enrollmentTypeMock,
    );

    prismaMock.vacancy.findUnique.mockResolvedValue(null);

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      NotFoundException,
    );

    expect(prismaMock.enrollment.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud cuando la vacante está llena', async () => {
    configureValidRequest();

    prismaMock.vacancy.findUnique.mockResolvedValue({
      ...vacancyMock,
      capacity: 30,
      occupiedCount: 30,
    });

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      ConflictException,
    );

    expect(prismaMock.enrollment.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud si el estudiante ya tiene una matrícula en el periodo', async () => {
    configureValidRequest();

    prismaMock.enrollment.findFirst.mockResolvedValue({
      id: 'existing-enrollment-id',
    });

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      ConflictException,
    );

    expect(prismaMock.enrollmentRequest.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud si ya existe otra solicitud activa', async () => {
    configureValidRequest();

    prismaMock.enrollmentRequest.findFirst.mockResolvedValue({
      id: 'existing-request-id',
      status: 'PENDIENTE',
    });

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      ConflictException,
    );

    expect(prismaMock.requirementSet.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe rechazar la solicitud si no hay requisitos publicados', async () => {
    configureValidRequest();

    prismaMock.requirementSet.findFirst.mockResolvedValue(null);

    await expect(useCase.execute(dto, submittedByUserId)).rejects.toThrow(
      BadRequestException,
    );

    expect(prismaMock.enrollmentRequest.create).not.toHaveBeenCalled();
  });

  it('debe crear correctamente una solicitud de matrícula', async () => {
    configureValidRequest();

    const result = await useCase.execute(dto, submittedByUserId);

    expect(result).toMatchObject({
      id: 'request-test-id',
      studentId: dto.studentId,
      submittedByUserId: submittedByUserId,
      vacancyId: vacancyMock.id,
      periodId: vacancyMock.periodId,
      requirementSetId: 'requirement-set-test-id',
      status: 'PENDIENTE',
    });

    expect(prismaMock.enrollmentRequest.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          studentId: dto.studentId,
          submittedByUserId: submittedByUserId,
          status: 'PENDIENTE',
        }),
      }),
    );
  });
});
