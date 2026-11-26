import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

@Injectable()
export class ResubmitEnrollmentRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(requestId: string, guardianUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar la solicitud.
      const request = await tx.enrollmentRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          studentId: true,
          status: true,
        },
      });

      if (!request) {
        throw new NotFoundException('La solicitud no existe.');
      }

      // 2. Verificar que el usuario sea el apoderado vinculado al estudiante.
      const guardianLink = await tx.guardianStudent.findUnique({
        where: {
          guardianUserId_studentId: {
            guardianUserId,
            studentId: request.studentId,
          },
        },
      });

      if (!guardianLink) {
        throw new ForbiddenException(
          'El apoderado no está vinculado al estudiante de esta solicitud.',
        );
      }

      // 3. Solo se pueden subsanar solicitudes OBSERVADAS.
      if (request.status !== 'OBSERVADA') {
        throw new ConflictException(
          'Solo se pueden subsanar solicitudes en estado OBSERVADA.',
        );
      }

      // 4. Cambiar el estado de forma condicional.
      const updated = await tx.enrollmentRequest.updateMany({
        where: {
          id: requestId,
          status: 'OBSERVADA',
        },
        data: {
          status: 'PENDIENTE',
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'La solicitud cambió de estado. Intente nuevamente.',
        );
      }

      // 5. Registrar la subsanación en el historial.
      const review = await tx.requestReview.create({
        data: {
          requestId,
          actorUserId: guardianUserId,
          action: 'SUBSANADA',
          comment: 'El apoderado volvió a presentar la solicitud.',
        },
      });

      // 6. Devolver el resultado.
      return {
        requestId,
        previousStatus: 'OBSERVADA',
        currentStatus: 'PENDIENTE',
        review,
      };
    });
  }
}
