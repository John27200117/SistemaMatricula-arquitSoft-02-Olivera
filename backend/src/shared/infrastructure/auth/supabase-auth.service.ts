import 'dotenv/config';
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createClient, type User } from '@supabase/supabase-js';

@Injectable()
export class SupabaseAuthService {
  private readonly supabase;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !publishableKey) {
      throw new Error(
        'SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY deben estar configuradas.',
      );
    }

    this.supabase = createClient(supabaseUrl, publishableKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false,
      },
    });
  }

  async verifyAccessToken(accessToken: string): Promise<User> {
    const { data, error } =
      await this.supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      throw new UnauthorizedException(
        'El token de autenticación no es válido o ha expirado.',
      );
    }

    return data.user;
  }
}
