import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserContextService } from 'src/app/services/user-context.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private userContext: UserContextService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          localStorage.setItem('token', response.token);
          const decodedToken = this.decodeToken(response.token);
          this.userContext.setRoleFromToken();
          if (decodedToken.role === 'ROLE_ADMIN') {
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.router.navigate(['/user-dashboard']);
          }
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
        }
      });
    }
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
