import { Routes } from '@angular/router';
import {
  canActivate,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from '@angular/fire/auth-guard';

// If not logged in -> throws to login
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

// If already logged in -> throw it on the board (so as not to show the login again)
const redirectLoggedInToBoard = () => redirectLoggedInTo(['board']);

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then((m) => m.LoginComponent),
    // If the user already exists, we don't let him log in, but directly to the board
    ...canActivate(redirectLoggedInToBoard),
  },
  {
    path: 'board',
    loadComponent: () =>
      import('./pages/board/board.component').then((m) => m.BoardComponent),
    // If there is no user, we throw it at login
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: '',
    redirectTo: 'login', // or 'board', the guard will figure it out on its own
    pathMatch: 'full',
  },
];
