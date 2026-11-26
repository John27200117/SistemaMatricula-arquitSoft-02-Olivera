export interface AuthenticatedUser {
  id: string;
  authSubject: string;
  roles: string[];
}
