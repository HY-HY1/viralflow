import { AuthenticationErrorResponse, AuthorizationErrorResponse, ValidationErrorResponse } from "@/types/api/errors";
import { NextResponse } from "next/server";

export const authorizationErrorResponse: AuthorizationErrorResponse = {
  success: false,
  message: "Could not authorize user",
  statusCode: 403,
};

export const authenticatioErrorResponse: AuthenticationErrorResponse = {
  success: false,
  message: "User does not exist",
  statusCode: 401,
};

export const validationErrorResponse: ValidationErrorResponse = {
  success: false,
  message: "Fields are missing",
  statusCode: 400,
  errors: ["email", "password", "firstName", "lastName"],
};

export function handleErrorResponse(message: string, statusCode: number) {
  return NextResponse.json(
    {
      success: false,
      message,
      statusCode,
    },
    { status: statusCode }
  );
}

