import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private toaster:ToastrService
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email:['', [Validators.required, Validators.email]],
      phoneNumber:['', [Validators.required, Validators.pattern('^\\+?[0-9]{10,15}$')]],
      password: ['', Validators.required],
      role: ['ROLE_USER', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.router.navigate(['/login']);
          this.toaster.success('Please log in with your new account!',res.message,{
            timeOut:5000
          })
        },
        error: (err) => {
          console.error(err);
          this.toaster.error('Signup failed. Please try again.');
        }
      });
    }else{
      this.markFormGroupTouched(this.signupForm);
    }
  }

  markFormGroupTouched(formGroup:FormGroup){
    Object.values(formGroup.controls).forEach(control =>{
      control.markAsTouched();
    })
  }

  
  
  allowOnlyAlphaNumeric(event: KeyboardEvent) {
    const regex = /^[A-Za-z0-9]+$/;
    const inputChar = String.fromCharCode(event.keyCode || event.which);

    if (!regex.test(inputChar)) {
      event.preventDefault();
    }
  }

}
