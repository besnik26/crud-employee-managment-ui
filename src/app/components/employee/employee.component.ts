import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,Validators   } from '@angular/forms';
import { Employee } from 'src/app/models/employee.model';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.scss']
})
export class EmployeeComponent implements OnInit{
  myForm!: FormGroup;
  skillsList: string[] = ['Java', 'Angular', 'Spring Boot', 'AWS'];

  employee: Employee={
    employeeId: 0,
    employeeName: '',
    employeeContactNumber: '',
    employeeAddress: '',
    employeeGender: '',
    employeeDepartment: '',
    employeeSkills: ''
  }

  constructor(private formBuilder: FormBuilder) {
  this.myForm = this.formBuilder.group({
    employeeId: ['', Validators.required],
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

  ngOnInit(): void {
      
  }

  getSelectedSkills(): string[] {
  const selectedSkills = this.myForm.value.employeeSkills
    .map((checked: boolean, index: number) => checked ? this.skillsList[index] : null)
    .filter((v: string | null) => v !== null);
  return selectedSkills as string[];
}

  onSubmit(){
    const formValue = {...this.myForm.value};
    formValue.employeeSkills = this.getSelectedSkills();
    console.log('Submitted employee:', formValue)
  }
}
