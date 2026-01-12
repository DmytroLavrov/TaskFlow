import { inject, Injectable } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);

  // A special Observable that itself monitors:
  // if the user is logged in - there is a User object here, if logged out - here is null.
  public user$: Observable<User | null> = user(this.auth);

  // Login with Google (pop-up)
  public login(): Promise<UserCredential> {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  public logout(): Promise<void> {
    return signOut(this.auth);
  }
}
