import User from "@/models/user";
import {
  AuthenticationErrorResponse,
  GeneralErrorResponse,
} from "@/types/api/errors";
import { DecodedToken } from "@/types/jwt/JWT";
import { IUser } from "@/types/schema/SchemaTypes";
import { DecodeJWT } from "@/utils/auth";
import { authenticatioErrorResponse } from "@/utils/errors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        {
          success: false,
          message: "Authorization header missing",
          statusCode: 401,
        },
        { status: 401 }
      );
    }
    const token = authHeader.split(" ")[1];

    const decodedToken: DecodedToken | null = await DecodeJWT(token);

    const findUser : IUser | null  = await User.findById(decodedToken?.userId);

    if (!findUser) {
      return NextResponse.json(authenticatioErrorResponse, { status: 40  });
    }

    if(!decodedToken) {
        const authErrorResponse: AuthenticationErrorResponse = {
            success: false,
            message: "Invalid or expired token",
            statusCode: 401,
        };
        return NextResponse.json(authErrorResponse, { status: 401 });
    }

    await User.findByIdAndDelete(decodedToken.userId) // Delete User


    const response = {
        success: true,
        message: `Deletion of ${findUser.password} with id of ${findUser._id} successful`,
        statusCode: 201,
        token
    };
    return NextResponse.json(response, { status: 201 });

    // Continue with your logic using the token
  } catch (error: unknown) {
    if (error instanceof Error) {
      const serverErrorResponse: GeneralErrorResponse = {
        success: false,
        message: `Internal Server Error: ${error.message}`,
        statusCode: 500,
        error: error.stack, // Include the stack trace if needed for debugging
      };
      return NextResponse.json(serverErrorResponse, { status: 500 });
    }

    const serverErrorResponse: GeneralErrorResponse = {
      success: false,
      message: "Unknown error occurred",
      statusCode: 500,
      error: "Unknown error",
    };
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
