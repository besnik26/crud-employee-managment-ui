import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee.model';
import { EmployeeService } from 'src/app/services/employee.service';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit{
  dataSource: Employee[] = [];
  displayedColumns: string[] = ['employeeId', 'employeeName', 'employeeContactNumber', 'employeeAddress', 'employeeGender','employeeDepartment','employeeSkills'];

  constructor(private employeeService:EmployeeService){
    this.getEmployeeList();
  }

  ngOnInit(): void {

  }

  getEmployeeList():void{
    this.employeeService.getEmployees().subscribe(
      {
        next: (res:Employee[])=>{
          this.dataSource = res;
        },
        error: (err: HttpErrorResponse)=>{
          console.log(err);
        }
      }
    )
  }

}
