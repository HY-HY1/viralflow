import User from "@/models/user";
import {
  GeneralErrorResponse,
} from "@/types/api/errors";
import { DecodedToken } from "@/types/jwt/JWT";
import { DecodeJWT } from "@/utils/auth";
import { handleErrorResponse } from "@/utils/errors";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function GET(req: Request) {
  try {
    // Check the Authorization header
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return handleErrorResponse("Authorization header is missing", 403);
    }

    const tokenParts = authHeader.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return handleErrorResponse("Invalid Authorization header format", 403);
    }

    const token = tokenParts[1];
    const decodedToken: DecodedToken | null = DecodeJWT(token);

    if (!decodedToken || !decodedToken.userId) {
      return handleErrorResponse("Invalid or missing token", 401);
    }

    const UserData = await redis.get("UserData")

    if(UserData) {

      console.log("Redis Hit")
      const data = JSON.parse(UserData)

      return NextResponse.json({
        success: true,
        message: "User data retrieved successfully",
        user: data
      })
    }
    console.log("Redis Missed")

    const findUser = await User.findById(decodedToken.userId.toString());
    if (!findUser) {
      return handleErrorResponse("User does not exist", 401);
    }

    await redis.set("UserData", JSON.stringify(findUser))


    return NextResponse.json(
      {
        success: true,
        message: "User data retrieved successfully",
        user: findUser
      },
      { status: 200 }
    );


  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    const serverErrorResponse: GeneralErrorResponse = {
      success: false,
      message: `Internal Server Error: ${errorMessage}`,
      statusCode: 500,
      error: error instanceof Error ? error.stack : "Unknown error",
    };
    return NextResponse.json(serverErrorResponse, { status: 500 });
  }
}
