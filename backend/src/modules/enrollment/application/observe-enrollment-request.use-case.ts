
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

interface ObserveEnrollmentRequestInput {
  actorUserId: string;
  comment: string;
}

@Injectable()
export class ObserveEnrollmentRequestUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    requestId: string,
    input: ObserveEnrollmentRequestInput,
  ) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Comprobar que la solicitud exista.
      const request = await tx.enrollmentRequest.findUnique({
        where: { id: requestId },
        select: { id: true, status: true },
      });

      if (!request) {
        throw new NotFoundException('La solicitud no existe.');
      }

      // 2. Solo se pueden observar solicitudes EN_REVISION.
      if (request.status !== 'EN_REVISION') {
        throw new ConflictException(
          'Solo se pueden observar solicitudes que estén EN_REVISION.',
        );
      }

      // 3. Actualizar el estado de forma condicional.
      const updated = await tx.enrollmentRequest.updateMany({
        where: {
          id: requestId,
          status: 'EN_REVISION',
        },
        data: {
          status: 'OBSERVADA',
        },
      });

      if (updated.count !== 1) {
        throw new ConflictException(
          'La solicitud cambió de estado. Intente nuevamente.',
        );
      }

      // 4. Registrar la observación en el historial.
      const review = await tx.requestReview.create({
        data: {
          requestId,
          actorUserId: input.actorUserId,
          action: 'OBSERVADA',
          comment: input.comment,
        },
      });

      // 5. Devolver el resultado.
      return {
        requestId,
        previousStatus: 'EN_REVISION',
        currentStatus: 'OBSERVADA',
        review,
      };
    });
  }
}
