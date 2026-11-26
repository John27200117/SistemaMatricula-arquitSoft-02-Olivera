
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

@Injectable()
export class GetEnrollmentRequestByIdUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(requestId: string) {
    const request = await this.prisma.enrollmentRequest.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        studentId: true,
        submittedByUserId: true,
        vacancyId: true,
        periodId: true,
        requirementSetId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
          select: {
            id: true,
            actorUserId: true,
            action: true,
            comment: true,
            createdAt: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        enrollment: {
          select: {
            id: true,
            approvedAt: true,
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('La solicitud no existe.');
    }

    return request;
  }
}
