import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';
import type { CreateEnrollmentRequestDto } from '../presentation/dto/create-enrollment-request.dto.js';

@Injectable()
export class CreateEnrollmentRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CreateEnrollmentRequestDto, submittedByUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Verificar que el apoderado esté vinculado al estudiante.
      const guardianLink = await tx.guardianStudent.findUnique({
        where: {
          guardianUserId_studentId: {
            guardianUserId: submittedByUserId,
            studentId: dto.studentId,
          },
        },
      });

      if (!guardianLink) {
        throw new ForbiddenException(
          'El apoderado no está vinculado al estudiante indicado.',
        );
      }

      // 2. Verificar que el tipo de matrícula exista y esté activo.
      const enrollmentType = await tx.enrollmentType.findUnique({
        where: { id: dto.enrollmentTypeId },
      });

      if (!enrollmentType || !enrollmentType.isActive) {
        throw new BadRequestException(
          'El tipo de matrícula no existe o está inactivo.',
        );
      }

      // 3. Verificar que la vacante exista.
      const vacancy = await tx.vacancy.findUnique({
        where: { id: dto.vacancyId },
      });

      if (!vacancy) {
        throw new NotFoundException('La vacante indicada no existe.');
      }

      // 4. Comprobar que existan cupos disponibles.
      if (vacancy.occupiedCount >= vacancy.capacity) {
        throw new ConflictException(
          'La vacante seleccionada no tiene cupos disponibles.',
        );
      }

      // 5. Verificar si el estudiante ya tiene una matrícula aprobada.
      const existingEnrollment = await tx.enrollment.findFirst({
        where: {
          studentId: dto.studentId,
          periodId: vacancy.periodId,
        },
      });

      if (existingEnrollment) {
        throw new ConflictException(
          'El estudiante ya tiene una matrícula registrada en este periodo.',
        );
      }

      // 6. Verificar si existe otra solicitud activa para el mismo periodo.
      const existingRequest = await tx.enrollmentRequest.findFirst({
        where: {
          studentId: dto.studentId,
          periodId: vacancy.periodId,
          status: {
            in: ['PENDIENTE', 'EN_REVISION', 'OBSERVADA'],
          },
        },
      });

      if (existingRequest) {
        throw new ConflictException(
          'El estudiante ya tiene una solicitud activa para este periodo.',
        );
      }
      
      // 7. Buscar los requisitos publicados para el tipo y periodo.
      const requirementSet = await tx.requirementSet.findFirst({
        where: {
          enrollmentTypeId: enrollmentType.id,
          academicPeriodId: vacancy.periodId,
          status: 'PUBLISHED',
        },
        select: { id: true },
      });

      if (!requirementSet) {
        throw new BadRequestException(
          'No existe un conjunto de requisitos publicado para este tipo de matrícula y periodo.',
        );
      }

      // 8. Registrar la solicitud.
      return tx.enrollmentRequest.create({
        data: {
          studentId: dto.studentId,
          submittedByUserId: submittedByUserId,
          vacancyId: vacancy.id,
          periodId: vacancy.periodId,
          requirementSetId: requirementSet.id,
          status: 'PENDIENTE',
        },
        select: {
          id: true,
          studentId: true,
          submittedByUserId: true,
          vacancyId: true,
          periodId: true,
          requirementSetId: true,
          status: true,
          createdAt: true,
        },
      });
    });
  }
}
