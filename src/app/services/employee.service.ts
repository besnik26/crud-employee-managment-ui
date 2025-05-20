import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  api = "http://localhost:9090"

  constructor(private httpClient:HttpClient) { }
  
  public saveEmployee(employee:Employee):Observable<Employee>{
    return this.httpClient.post<Employee>(`${this.api}/save/employee`, employee);
  }
}
