import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit{
  isLoading = false;
  form!: FormGroup;
  companyId!: number;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    private toaster:ToastrService
  ) {}

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]],
      industry: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]],
      location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40) ]]
    });

    this.adminService.getCompanyById(this.companyId).subscribe(company => {
      this.form.patchValue(company);
    });
  }

  onSubmit(): void {
    if (this.form.valid){
      this.isLoading = true;
      this.adminService.updateCompany(this.companyId, this.form.value).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/admin-dashboard']);
        this.toaster.success('Company info edited successfully!')
      });
    }else{
      this.isLoading = false;
      this.markFormGroupTouched(this.form);
    }


  }

  markFormGroupTouched(formGroup:FormGroup){
    Object.values(formGroup.controls).forEach(control =>{
      control.markAsTouched();
    })
  }
}
