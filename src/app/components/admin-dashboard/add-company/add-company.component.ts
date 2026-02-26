import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss']
})
export class AddCompanyComponent {
  isLoading = false;
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private toaster:ToastrService
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]],
      industry: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]]
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.isLoading = true;
      this.adminService.addCompany(this.companyForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin-dashboard'])
          this.toaster.success('Company added successfully!')
        },

        error: err => {
          this.isLoading = false;
          this.toaster.error('Failed to add company!')
        }
      });
    }
    else{
      this.markFormGroupTouched(this.companyForm)
    }
  }

  markFormGroupTouched(formGroup:FormGroup){
    Object.values(formGroup.controls).forEach(control =>{
      control.markAsTouched();
    })
  }
}
