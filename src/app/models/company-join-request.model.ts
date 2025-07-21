export interface CompanyJoinRequest {
  id: number;
  user: {
    id: number;
    username: string;
  };
  company: {
    id: number;
    name: string;
    industry: string;
    location: string;
  };
  status: string;
  createdAt: string;
}