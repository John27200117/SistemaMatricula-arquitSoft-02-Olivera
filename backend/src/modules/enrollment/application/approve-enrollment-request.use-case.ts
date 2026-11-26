
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

interface ApproveEnrollmentRequestInput {
  actorUserId: string;
}

@Injectable()
export class ApproveEnrollmentRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    requestId: string,
    input: ApproveEnrollmentRequestInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar la solicitud.
      const request = await tx.enrollmentRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          studentId: true,
          periodId: true,
          vacancyId: true,
          status: true,
        },
      });

      if (!request) {
        throw new NotFoundException('La solicitud no existe.');
      }

      // 2. Solo se pueden aprobar solicitudes EN_REVISION.
      if (request.status !== 'EN_REVISION') {
        throw new ConflictException(
          'Solo se pueden aprobar solicitudes en estado EN_REVISION.',
        );
      }

      // 3. Buscar la vacante.
      const vacancy = await tx.vacancy.findUnique({
        where: { id: request.vacancyId },
        select: {
          id: true,
          capacity: true,
          occupiedCount: true,
        },
      });

      if (!vacancy) {
        throw new NotFoundException(
          'La vacante de la solicitud no existe.',
        );
      }

      if (vacancy.occupiedCount >= vacancy.capacity) {
        throw new ConflictException(
          'No existen cupos disponibles para aprobar esta solicitud.',
        );
      }

      // 4. Cambiar el estado de manera condicional.
      const updatedRequest = await tx.enrollmentRequest.updateMany({
        where: {
          id: requestId,
          status: 'EN_REVISION',
        },
        data: {
          status: 'APROBADA',
        },
      });

      if (updatedRequest.count !== 1) {
        throw new ConflictException(
          'La solicitud cambió de estado. Intente nuevamente.',
        );
      }

      // 5. Incrementar el cupo solo si sigue teniendo el mismo contador.
      const updatedVacancy = await tx.vacancy.updateMany({
        where: {
          id: vacancy.id,
          capacity: vacancy.capacity,
          occupiedCount: vacancy.occupiedCount,
        },
        data: {
          occupiedCount: {
            increment: 1,
          },
        },
      });

      if (updatedVacancy.count !== 1) {
        throw new ConflictException(
          'La disponibilidad de la vacante cambió. Intente nuevamente.',
        );
      }

      // 6. Crear el registro de matrícula.
      const enrollment = await tx.enrollment.create({
        data: {
          requestId: request.id,
          studentId: request.studentId,
          periodId: request.periodId,
          vacancyId: request.vacancyId,
          approvedAt: new Date(),
        },
      });

      // 7. Registrar la aprobación en el historial.
      const review = await tx.requestReview.create({
        data: {
          requestId,
          actorUserId: input.actorUserId,
          action: 'APROBADA',
          comment: 'La solicitud fue aprobada y se registró la matrícula.',
        },
      });

      // 8. Devolver el resultado.
      return {
        requestId,
        previousStatus: 'EN_REVISION',
        currentStatus: 'APROBADA',
        enrollment,
        vacancy: {
          id: vacancy.id,
          previousOccupiedCount: vacancy.occupiedCount,
          currentOccupiedCount: vacancy.occupiedCount + 1,
          capacity: vacancy.capacity,
        },
        review,
      };
    });
  }
}
