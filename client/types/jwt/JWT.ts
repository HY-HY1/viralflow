export interface DecodedToken {
    userId: string;
    iat?: number; // Issued at timestamp
    exp?: number; // Expiration timestamp
  }