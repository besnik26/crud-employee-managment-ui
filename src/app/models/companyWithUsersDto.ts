import { UserDto } from "./userDto";

export interface CompanyWithUsersDto {
  id: number;
  name: string;
  industry: string;
  location: string;
  users: UserDto[];
}
