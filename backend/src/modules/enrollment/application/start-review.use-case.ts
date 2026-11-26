import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

@Injectable()
export class StartReviewUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(requestId: string, actorUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Comprobar que la solicitud exista.
      const request = await tx.enrollmentRequest.findUnique({
        where: { id: requestId },
        select: { id: true, status: true },
      });

      if (!request) {
        throw new NotFoundException('La solicitud no existe.');
      }

      if (request.status !== 'PENDIENTE') {
        throw new ConflictException(
          'Solo se pueden iniciar revisiones de solicitudes PENDIENTES.',
        );
      }

      // 2. Cambiar el estado de manera condicional.
      const updated = await tx.enrollmentRequest.updateMany({
        where: {
          id: requestId,
          status: 'PENDIENTE',
        },
        data: {
          status: 'EN_REVISION',
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'La solicitud cambió de estado. Intente nuevamente.',
        );
      }

      // 3. Registrar la acción en el historial.
      const review = await tx.requestReview.create({
        data: {
          requestId,
          actorUserId,
          action: 'REVISION_INICIADA',
          comment: 'Se inició la revisión de la solicitud.',
        },
      });

      // 4. Devolver el resultado.
      return {
        requestId,
        previousStatus: 'PENDIENTE',
        currentStatus: 'EN_REVISION',
        review,
      };
    });
  }
}
