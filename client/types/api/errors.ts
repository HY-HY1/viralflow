export interface ErrorResponse {
  success: boolean;
  message: string;
  statusCode: number;
  error?: string; // Optional field for detailed error information (e.g., stack trace)
}

export interface GeneralErrorResponse extends ErrorResponse {
  success: false;
  message: string; // e.g. "Something went wrong"
  statusCode: 500; // Internal Server Error
  error?: string; // Optional field to include more specific error details (e.g. stack trace)
}

export interface ValidationErrorResponse extends ErrorResponse {
  success: false;
  message: string; // e.g. "Missing required fields"
  statusCode: 400; // Bad Request
  errors?: string[]; // Optional array of specific validation errors
}

export interface AuthenticationErrorResponse extends ErrorResponse {
  success: false;
  message: string; // e.g. "Invalid email or password"
  statusCode: 401; // Unauthorized
  emailHasAccount?: boolean
}

export interface AuthorizationErrorResponse extends ErrorResponse {
  success: false;
  message: string; // e.g. "You do not have permission to access this resource"
  statusCode: 403; // Forbidden
}

export interface DatabaseErrorResponse extends ErrorResponse {
  success: false;
  message: string; // e.g. "Database connection failed"
  statusCode: 500; // Internal Server Error
  error?: string; // Optionally include detailed error message
}
