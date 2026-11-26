import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { GetEnrollmentTypesUseCase } from '../application/get-enrollment-types.use-case.js';
import { GetVacanciesUseCase } from '../application/get-vacancies.use-case.js';
import { CreateEnrollmentRequestUseCase } from '../application/create-enrollment-request.use-case.js';
import { GetEnrollmentRequestsUseCase } from '../application/get-enrollment-requests.use-case.js';
import { CreateEnrollmentRequestDto } from './dto/create-enrollment-request.dto.js';
import { StartReviewUseCase } from '../application/start-review.use-case.js';
import { ObserveEnrollmentRequestUseCase } from '../application/observe-enrollment-request.use-case.js';
import { ObserveEnrollmentRequestDto } from './dto/observe-enrollment-request.dto.js';
import { ResubmitEnrollmentRequestUseCase } from '../application/resubmit-enrollment-request.use-case.js';
import { ResubmitEnrollmentRequestDto } from './dto/resubmit-enrollment-request.dto.js';
import { ApproveEnrollmentRequestUseCase } from '../application/approve-enrollment-request.use-case.js';
import { ApproveEnrollmentRequestDto } from './dto/approve-enrollment-request.dto.js';
import { RejectEnrollmentRequestUseCase } from '../application/reject-enrollment-request.use-case.js';
import { RejectEnrollmentRequestDto } from './dto/reject-enrollment-request.dto.js';
import { GetEnrollmentRequestByIdUseCase } from '../application/get-enrollment-request-by-id.use-case.js';
import { SupabaseAuthGuard } from '../../../shared/infrastructure/auth/supabase-auth.guard.js';
import { RolesGuard } from '../../../shared/infrastructure/auth/roles.guard.js';
import { Roles } from '../../../shared/infrastructure/auth/roles.decorator.js';
import { CurrentUser } from '../../../shared/infrastructure/auth/current-user.decorator.js';
import type { AuthenticatedUser } from '../../../shared/infrastructure/auth/authenticated-user.interface.js';

@ApiTags('enrollment')
@Controller()
export class EnrollmentCatalogController {
  constructor(
    private readonly getEnrollmentTypes: GetEnrollmentTypesUseCase,
    private readonly getVacancies: GetVacanciesUseCase,
    private readonly createEnrollmentRequest: CreateEnrollmentRequestUseCase,
    private readonly getEnrollmentRequests: GetEnrollmentRequestsUseCase,
    private readonly startReview: StartReviewUseCase,
    private readonly observeEnrollmentRequest: ObserveEnrollmentRequestUseCase,
    private readonly resubmitEnrollmentRequest: ResubmitEnrollmentRequestUseCase,
    private readonly approveEnrollmentRequest: ApproveEnrollmentRequestUseCase,
    private readonly rejectEnrollmentRequest: RejectEnrollmentRequestUseCase,
    private readonly getEnrollmentRequestById: GetEnrollmentRequestByIdUseCase,
  ) {}

  @Get('enrollment-types')
  @ApiOperation({ summary: 'Lista los tipos de matrícula activos' })
  @ApiOkResponse({ description: 'Tipos de matrícula disponibles.' })
  getTypes() {
    return this.getEnrollmentTypes.execute();
  }

  @Get('vacancies')
  @ApiOperation({ summary: 'Consulta las vacantes registradas' })
  @ApiOkResponse({ description: 'Listado de vacantes y cupos disponibles.' })
  getVacanciesList() {
    return this.getVacancies.execute();
  }

  @Post('enrollment-requests')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('APODERADO')
  @ApiOperation({ summary: 'Registra una solicitud de matrícula' })
  @ApiCreatedResponse({ description: 'Solicitud registrada correctamente.' })
  createRequest(
    @Body() dto: CreateEnrollmentRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createEnrollmentRequest.execute(dto, user.id);
  }

  @Get('enrollment-requests')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Lista las solicitudes de matrícula registradas' })
  @ApiOkResponse({ description: 'Listado de solicitudes de matrícula.' })
  getRequests() {
    return this.getEnrollmentRequests.execute();
  }
  
  @Post('enrollment-requests/:id/start-review')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Inicia la revisión administrativa de una solicitud' })
  @ApiCreatedResponse({ description: 'Revisión iniciada correctamente.' })
  startReviewRequest(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.startReview.execute(id, user.id);
  }
  
  @Post('enrollment-requests/:id/observe')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Registra una observación en una solicitud de matrícula' })
  @ApiCreatedResponse({ description: 'Solicitud observada correctamente.' })
  observeRequest(
    @Param('id') id: string,
    @Body() dto: ObserveEnrollmentRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.observeEnrollmentRequest.execute(id, {
      actorUserId: user.id,
      comment: dto.comment,
    });
  }

  @Post('enrollment-requests/:id/resubmit')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('APODERADO')
  @ApiOperation({ summary: 'Subsanar y volver a presentar una solicitud observada' })
  @ApiCreatedResponse({ description: 'Solicitud subsanada correctamente.' })
  resubmitRequest(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.resubmitEnrollmentRequest.execute(id, user.id);
  }
  
  @Post('enrollment-requests/:id/approve')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Aprueba una solicitud y registra la matrícula' })
  @ApiCreatedResponse({ description: 'Solicitud aprobada y matrícula registrada.' })
  approveRequest(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.approveEnrollmentRequest.execute(id, {
      actorUserId: user.id,
    });
  }
  
  @Post('enrollment-requests/:id/reject')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Rechazar una solicitud de matrícula' })
  @ApiCreatedResponse({ description: 'Solicitud rechazada correctamente.' })
  rejectRequest(
    @Param('id') id: string,
    @Body() dto: RejectEnrollmentRequestDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.rejectEnrollmentRequest.execute(id, {
      actorUserId: user.id,
      comment: dto.comment,
    });
  }
  
  @Get('enrollment-requests/:id')
  @UseGuards(SupabaseAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @Roles('ADMINISTRADOR')
  @ApiOperation({ summary: 'Consultar una solicitud y su historial' })
  @ApiOkResponse({ description: 'Detalle de la solicitud obtenido correctamente.' })
  getEnrollmentRequestByIdHandler(@Param('id') id: string) {
    return this.getEnrollmentRequestById.execute(id);
  }
}
