import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserContextService } from 'src/app/services/user-context.service';
import { ToastrService } from 'ngx-toastr';
import { timeout } from 'rxjs';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router, 
    private userContext: UserContextService,
    private toaster:ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.toaster.warning('Sorry if there is a delay with the requests. That is because the backend service is a free instance service!','Delay warning',{
      timeOut:6000
    })
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
            this.toaster.success('Login successfull!')
          } else {
            this.router.navigate(['/user-dashboard']);
            this.toaster.success('Login successfull!')

          }
        },
        error: () => {
          this.errorMessage = 'Invalid username or password';
          this.toaster.error('Invalid username or password');
        }
      });
    }
  }

  decodeToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
}
