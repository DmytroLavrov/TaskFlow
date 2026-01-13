import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public isLoading = false;

  public async login(): Promise<void> {
    try {
      this.isLoading = true;
      await this.authService.login();
      this.router.navigate(['/board']);
    } catch (error) {
      console.error('Login error:', error);
      this.isLoading = false;
    }
  }
}
