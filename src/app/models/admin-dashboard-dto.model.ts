import { CompanySummaryDto } from "./companySummaryDto";

export interface AdminDashboardDto {
  firstName:string;
  lastName:string;
  adminEmail: string;
  totalCompanies: number;
  companies: CompanySummaryDto[];
}
