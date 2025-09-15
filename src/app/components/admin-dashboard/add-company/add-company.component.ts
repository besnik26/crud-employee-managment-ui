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
  companyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router,
    private toaster:ToastrService
  ) {
    this.companyForm = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      location: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.adminService.addCompany(this.companyForm.value).subscribe({
        next: () => {
          this.router.navigate(['/admin-dashboard'])
          this.toaster.success('Company added successfully!')
        },

        error: err => {
          this.toaster.error('Failed to add company!')
        }
      });
    }
  }
}
