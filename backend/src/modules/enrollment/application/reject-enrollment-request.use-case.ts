
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

interface RejectEnrollmentRequestInput {
  actorUserId: string;
  comment: string;
}

@Injectable()
export class RejectEnrollmentRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    requestId: string,
    input: RejectEnrollmentRequestInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Buscar la solicitud.
      const request = await tx.enrollmentRequest.findUnique({
        where: { id: requestId },
        select: {
          id: true,
          status: true,
        },
      });

      if (!request) {
        throw new NotFoundException('La solicitud no existe.');
      }

      // 2. Solo se pueden rechazar solicitudes EN_REVISION.
      if (request.status !== 'EN_REVISION') {
        throw new ConflictException(
          'Solo se pueden rechazar solicitudes en estado EN_REVISION.',
        );
      }

      // 3. Actualizar el estado de manera condicional.
      const updated = await tx.enrollmentRequest.updateMany({
        where: {
          id: requestId,
          status: 'EN_REVISION',
        },
        data: {
          status: 'RECHAZADA',
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'La solicitud cambió de estado. Intente nuevamente.',
        );
      }

      // 4. Registrar el rechazo en el historial.
      const review = await tx.requestReview.create({
        data: {
          requestId,
          actorUserId: input.actorUserId,
          action: 'RECHAZADA',
          comment: input.comment,
        },
      });

      // 5. Devolver el resultado.
      return {
        requestId,
        previousStatus: 'EN_REVISION',
        currentStatus: 'RECHAZADA',
        review,
      };
    });
  }
}
