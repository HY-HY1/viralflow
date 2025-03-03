import NextAuth from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import { MongooseConnect } from "@/lib/dbConnect";
import User from "@/models/user";
import bcrypt from "bcryptjs";

interface GoogleProfile {
  sub: string;
  name: string;
  email: string;
  picture: string;
  given_name: string;
  family_name: string;
}

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
}

const handler = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          access_type: "offline",
          response_type: "code"
        }
      },
      async profile(profile: GoogleProfile, tokens) {
        console.log("[OAuth Debug] Received tokens:", tokens);
        console.log("[OAuth Debug] Received Google Profile:", profile);
        try {
          const profileData = {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            image: profile.picture,
            firstName: profile.given_name,
            lastName: profile.family_name,
          };
          console.log("[OAuth Debug] Transformed Profile Data:", profileData);
          return profileData;
        } catch (error) {
          console.error("[OAuth Error] Error in profile transformation:", error);
          throw error;
        }
      }
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await MongooseConnect();
        const user = await User.findOne({ email: credentials.email }).select("+password");

        if (!user || !user.password) {
          throw new Error("Invalid credentials");
        }

        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name?.firstName + " " + user.name?.lastName,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/onboarding",
    error: "/onboarding",
    signOut: "/",
  },
  callbacks: {
    async session({ session, token }) {
      console.log("[Session Debug] Starting session callback");
      console.log("[Session Debug] Initial session:", session);
      console.log("[Session Debug] Token:", token);

      if (session.user) {
        try {
          await MongooseConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          console.log("[Session Debug] Found DB User:", dbUser);
          
          if (dbUser) {
            session.user = {
              id: dbUser._id.toString(),
              name: dbUser.name?.firstName + " " + dbUser.name?.lastName,
              email: dbUser.email,
              image: session.user.image,
              role: dbUser.role
            };
            console.log("[Session Debug] Updated session user:", session.user);
          }

          return session;
        } catch (error) {
          console.error("[Session Error] Error in session callback:", error);
          return session;
        }
      }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("\n[SignIn Debug] ====== Sign In Process Started ======");
      console.log("[SignIn Debug] Sign-in type:", account?.type || "unknown");
      console.log("[SignIn Debug] User object:", user);
      console.log("[SignIn Debug] Account details:", account);
      console.log("[SignIn Debug] Profile data:", profile);
      console.log("[SignIn Debug] Email:", email);
      console.log("[SignIn Debug] Has credentials:", !!credentials);

      try {
        if (!account) {
          console.error("[SignIn Error] No account object provided");
          return false;
        }

        if (account.type === "oauth" && !account.access_token) {
          console.error("[SignIn Error] No access token provided in OAuth flow");
          return false;
        }

        console.log("[SignIn Debug] Connecting to MongoDB...");
        await MongooseConnect();

        if (!user?.email) {
          console.error("[SignIn Error] No email provided in user object");
          return false;
        }
        
        // For OAuth sign in
        if (account?.type === "oauth") {
          console.log("[OAuth Debug] Processing OAuth sign in");
          const existingUser = await User.findOne({ email: user.email });
          console.log("[OAuth Debug] Existing user found:", existingUser ? "Yes" : "No");

          if (!existingUser) {
            console.log("[OAuth Debug] Creating new user");
            try {
              const newUser = await User.create({
                email: user.email,
                name: {
                  firstName: (profile as GoogleProfile)?.given_name || user.name?.split(" ")[0] || "",
                  lastName: (profile as GoogleProfile)?.family_name || user.name?.split(" ")[1] || "",
                },
                emailVerified: new Date(),
                image: user.image,
                role: "free"
              });
              console.log("[OAuth Debug] New user created:", newUser);
              return true;
            } catch (error) {
              console.error("[OAuth Error] Failed to create new user:", error);
              return false;
            }
          }

          console.log("[OAuth Debug] Updating existing user");
          try {
            const updatedUser = await User.findOneAndUpdate(
              { email: user.email },
              {
                $set: {
                  emailVerified: new Date(),
                  image: user.image || existingUser.image,
                  name: {
                    firstName: (profile as GoogleProfile)?.given_name || user.name?.split(" ")[0] || existingUser.name?.firstName,
                    lastName: (profile as GoogleProfile)?.family_name || user.name?.split(" ")[1] || existingUser.name?.lastName,
                  }
                }
              },
              { new: true }
            );
            console.log("[OAuth Debug] User updated:", updatedUser);
            return true;
          } catch (error) {
            console.error("[OAuth Error] Failed to update user:", error);
            return false;
          }
        }

        // For credentials sign in
        console.log("[SignIn Debug] Processing credentials sign in");
        const existingUser = await User.findOne({ email: user.email });
        console.log("[SignIn Debug] Credentials user found:", !!existingUser);
        return !!existingUser;
      } catch (error) {
        console.error("[SignIn Error] Error in signIn callback:", error);
        console.error("[SignIn Error] Stack trace:", error.stack);
        return false;
      } finally {
        console.log("[SignIn Debug] ====== Sign In Process Completed ======\n");
      }
    },
    async redirect({ url, baseUrl }) {
      console.log("\n[Redirect Debug] ====== Redirect Process Started ======");
      console.log("[Redirect Debug] Incoming URL:", url);
      console.log("[Redirect Debug] Base URL:", baseUrl);
      
      let finalUrl;
      // Always allow the callback URL
      if (url.includes('/api/auth/callback/')) {
        console.log("[Redirect Debug] Processing callback URL");
        finalUrl = url;
      }
      // For other URLs, check if they start with the base URL
      else if (url.startsWith(baseUrl)) {
        console.log("[Redirect Debug] Processing base URL");
        finalUrl = url;
      }
      // Default redirect
      else {
        console.log("[Redirect Debug] Using default redirect");
        finalUrl = `${baseUrl}/onboarding`;
      }
      
      console.log("[Redirect Debug] Final redirect URL:", finalUrl);
      console.log("[Redirect Debug] ====== Redirect Process Completed ======\n");
      return finalUrl;
    },
    async jwt({ token, account, user }) {
      console.log("[JWT Debug] ====== JWT Process Started ======");
      console.log("[JWT Debug] Initial token:", token);
      console.log("[JWT Debug] Account:", account);
      console.log("[JWT Debug] User:", user);

      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.id = user.id;
        console.log("[JWT Debug] Updated token:", token);
      }

      console.log("[JWT Debug] ====== JWT Process Completed ======\n");
      return token;
    }
  },
  debug: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST }; 