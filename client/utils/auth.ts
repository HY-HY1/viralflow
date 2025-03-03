import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"

// Your JWT Secret (preferably set in environment variables)
const JWT_SECRET = process.env.JWT_SECRET || "Harvey";

// Hashing a password before saving it
export const HashPassword = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt
        const hashedPassword = await bcrypt.hash(password, salt); // Hash the password with the salt
        return hashedPassword;
    } catch (error) {
        throw new Error(`Error hashing password  ${error}`);
    }
};

// Comparing the entered password with the hashed password in the DB
export const ComparePassword = async (enteredPassword: string, hashedPassword: string): Promise<boolean> => {
    try {
        const isMatch = await bcrypt.compare(enteredPassword, hashedPassword);
        return isMatch;
    } catch (error) {
        throw new Error(`Error comparing passwords ${error}`);
    }
};

// Signing a JWT token with the user ID (or any other relevant user data)
export const SignJWT = (userId: string): string => {
    try {
        // Payload can include user ID, email, or any data you want to encode into the token
        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour
        return token;
    } catch (error) {
        throw new Error(`Error signing JWT, ${error}`);
    }
};

export function DecodeJWT<T>(token: string): T | null {
    try {
      return jwt.verify(token, JWT_SECRET) as T;
    } catch (error) {
      console.error("Invalid or expired token:", error);
      return null;
    }
  }
  
