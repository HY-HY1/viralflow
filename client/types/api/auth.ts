import { AxiosResponse } from "axios";

export interface AuthResponseTypes {
  success: boolean;
  message: string;
  token?: string;  // Token is optional in case of errors.
}

export interface AuthResponse extends AxiosResponse {
  data: AuthResponseTypes;  // Override the 'data' property in AxiosResponse to use your custom type
}
