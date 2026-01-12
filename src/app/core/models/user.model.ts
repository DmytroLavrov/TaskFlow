import { User } from '@angular/fire/auth';

export interface UserCredential {
  user: User;
  providerId: string | null;
  operationType: 'signIn' | 'link' | 'reauthenticate';
}
