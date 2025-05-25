import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators   } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit{

  isCreateEmployee:boolean = true;
  myForm!: FormGroup;
  skillsList: string[] = ['Java', 'Angular', 'Spring Boot', 'AWS'];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService:EmployeeService,
    private route: Router,
    private activatedRoute:ActivatedRoute
  ) {}

  ngOnInit(): void {
      this.initForm();
  }


  saveEmployee(employee:Employee){
    this.employeeService.saveEmployee(employee).subscribe(
      {
        next:(res: Employee)=>{
          console.log(res);
          this.clearForm();
          this.route.navigate(['/']);

        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }
    );
  }

  updateEmployee(employee: Employee){
    this.employeeService.updateEmployee(employee).subscribe(
      {
        next:(res: Employee)=>{
          this.clearForm();
          this.route.navigate(['/']);
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      } 
    )
  }

  initForm() {
    const employee = this.activatedRoute.snapshot.data['employee'];

    if(employee && employee.employeeId > 0){
      this.isCreateEmployee = false;
    }else {
      this.isCreateEmployee = true;
    }

    const selectedSkills = employee.employeeSkills
    ? employee.employeeSkills.split(',').map((skill: string) => skill.trim())
    : [];

    const skillControls = this.skillsList.map(skill =>
      this.formBuilder.control(selectedSkills.includes(skill))
    );

    this.myForm = this.formBuilder.group({
      employeeId: [{ value: employee.employeeId, disabled: true }, Validators.required],
      employeeName: [employee.employeeName, Validators.required],
      employeeContactNumber: [employee.employeeContactNumber, Validators.required],
      employeeAddress: [employee.employeeAddress, Validators.required],
      employeeGender: [employee.employeeGender, Validators.required],
      employeeDepartment: [employee.employeeDepartment, Validators.required],
      employeeSkills: this.formBuilder.array(skillControls)
    });
  }

  getSelectedSkills(): string {
    return this.myForm.value.employeeSkills
      .map((checked: boolean, i: number) => checked ? this.skillsList[i] : null)
      .filter((v: string | null) => v !== null)
      .join(', ');
  }

  clearForm(){
    this.myForm.reset();
  }

  onSubmit() {
  const formValue: Employee = {
    ...this.myForm.getRawValue(),
    employeeSkills: this.getSelectedSkills()
  };

  if (this.isCreateEmployee) {
    if (this.myForm.valid) {
      this.saveEmployee(formValue);
    } else {
      console.error("Form Invalid!");
    }
  } else {
    if (this.myForm.valid) {
      this.updateEmployee(formValue);
    } else {
      console.error("Form Invalid!");
    }
  }
}
}
