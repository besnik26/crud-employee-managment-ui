import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompanyJoinRequest } from '../models/company-join-request.model';

@Injectable({
  providedIn: 'root',
})
export class JoinRequestService {
    private baseUrl = 'http://localhost:9090/api/join-requests';

    constructor(private http: HttpClient) {}

    getPendingRequests(): Observable<CompanyJoinRequest[]> {
        return this.http.get<CompanyJoinRequest[]>(`${this.baseUrl}/pending`);
    }

    respondToRequest(requestId: number, accepted: boolean): Observable<any> {
        return this.http.post(`${this.baseUrl}/${requestId}/respond?accepted=${accepted}`, {});
    }

    sendJoinRequest(userId: number, companyId: number): Observable<any> {
        return this.http.post(`${this.baseUrl}/send?userId=${userId}&companyId=${companyId}`, {});
    }
}