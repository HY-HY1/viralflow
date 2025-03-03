import { NextResponse } from "next/server";
import { MongooseConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import VerificationToken from "@/models/verificationToken";
import { GeneralErrorResponse } from "@/types/api/errors";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Verification token is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await MongooseConnect();

    // Find the verification token
    const verificationToken = await VerificationToken.findOne({
      token,
      type: 'emailVerification'
    });

    if (!verificationToken) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification token",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      await VerificationToken.deleteOne({ _id: verificationToken._id });
      return NextResponse.json(
        {
          success: false,
          message: "Verification token has expired",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Update user's email verification status
    const user = await User.findByIdAndUpdate(
      verificationToken.userId,
      { emailVerified: true },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    // Delete the verification token
    await VerificationToken.deleteOne({ _id: verificationToken._id });

    return NextResponse.json(
      {
        success: true,
        message: "Email verified successfully",
        statusCode: 200,
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    if (error instanceof Error) {
      const serverErrorResponse: GeneralErrorResponse = {
        success: false,
        message: `Internal Server Error: ${error.message}`,
        statusCode: 500,
        error: error.stack
      };
      return NextResponse.json(serverErrorResponse, { status: 500 });
    }

    const serverErrorResponse: GeneralErrorResponse = {
      success: false,
      message: "Unknown error occurred",
      statusCode: 500,
      error: "Unknown error"
    };
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
} 