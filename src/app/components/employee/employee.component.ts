import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators   } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit{
  myForm!: FormGroup;
  skillsList: string[] = ['Java', 'Angular', 'Spring Boot', 'AWS'];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService:EmployeeService
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
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      }
    );
  }

  initForm(){
    this.myForm = this.formBuilder.group({
      employeeId: [{ value: '0', disabled: true }, Validators.required],    
      employeeName: ['', Validators.required],
      employeeContactNumber: ['', Validators.required],
      employeeAddress: ['', Validators.required],
      employeeGender: ['', Validators.required],
      employeeDepartment: ['', Validators.required],
      employeeSkills: this.formBuilder.array(
        this.skillsList.map(() => this.formBuilder.control(false))
      )
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

  onSubmit(){
    const formValue:Employee = {...this.myForm.value};
    formValue.employeeSkills = this.getSelectedSkills();
    if(this.myForm.valid){
      this.saveEmployee(formValue);
    }else{
      console.error("Form Invalid!");
    }
  }
}
