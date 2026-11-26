import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/infrastructure/prisma.service.js';

@Injectable()
export class GetEnrollmentRequestsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  execute() {
    return this.prisma.enrollmentRequest.findMany({
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
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
