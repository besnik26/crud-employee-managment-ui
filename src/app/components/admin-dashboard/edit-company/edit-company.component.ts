import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-edit-company',
  templateUrl: './edit-company.component.html',
  styleUrls: ['./edit-company.component.scss']
})
export class EditCompanyComponent implements OnInit{
  form!: FormGroup;
  companyId!: number;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.companyId = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      name: ['', Validators.required],
      industry: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.adminService.getCompanyById(this.companyId).subscribe(company => {
      this.form.patchValue(company);
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.adminService.updateCompany(this.companyId, this.form.value).subscribe(() => {
      this.router.navigate(['/admin-dashboard']);
    });
  }
}
