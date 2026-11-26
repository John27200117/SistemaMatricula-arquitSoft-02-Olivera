import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service.js';
import { PrismaService } from '../prisma.service.js';
import { AuthenticatedUser } from './authenticated-user.interface.js';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseAuthService: SupabaseAuthService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Se requiere un token de autenticación.',
      );
    }

    const accessToken = authorization.substring(7);

    if (!accessToken) {
      throw new UnauthorizedException(
        'El token de autenticación está vacío.',
      );
    }

    const supabaseUser =
      await this.supabaseAuthService.verifyAccessToken(accessToken);

    const userAccount = await this.prisma.userAccount.findUnique({
      where: {
        authSubject: supabaseUser.id,
      },
      select: {
        id: true,
        authSubject: true,
        userRoles: {
          select: {
            role: {
              select: {
                code: true,
              },
            },
          },
        },
      },
    });

    if (!userAccount) {
      throw new ForbiddenException(
        'El usuario autenticado no está registrado en el sistema.',
      );
    }

    const authenticatedUser: AuthenticatedUser = {
      id: userAccount.id,
      authSubject: userAccount.authSubject,
      roles: userAccount.userRoles.map(
        (userRole) => userRole.role.code,
      ),
    };

    request.user = authenticatedUser;

    return true;
  }
}
