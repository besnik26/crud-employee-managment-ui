import { CompanySummaryDto } from "./companySummaryDto";

export interface AdminDashboardDto {
  adminUsername: string;
  totalCompanies: number;
  companies: CompanySummaryDto[];
}
