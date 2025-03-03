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
      profile(profile: GoogleProfile) {
        console.log("Google Profile:", profile);
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          firstName: profile.given_name,
          lastName: profile.family_name,
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
    async session({ session }) {
      if (session.user) {
        try {
          await MongooseConnect();
          const dbUser = await User.findOne({ email: session.user.email });
          
          if (dbUser) {
            session.user = {
              id: dbUser._id.toString(),
              name: dbUser.name?.firstName + " " + dbUser.name?.lastName,
              email: dbUser.email,
              image: session.user.image,
              role: dbUser.role
            };
          }

          return session;
        } catch (error) {
          console.error("Error in session callback:", error);
          return session;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      console.log("SignIn Callback - User:", user);
      console.log("SignIn Callback - Account:", account);
      console.log("SignIn Callback - Profile:", profile);

      try {
        await MongooseConnect();

        if (!user?.email) {
          console.error("No email provided in user object");
          return false;
        }
        
        // For OAuth sign in
        if (account?.type === "oauth") {
          const existingUser = await User.findOne({ email: user.email });
          console.log("Existing user found:", existingUser);

          if (!existingUser) {
            // Create new user for OAuth
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
            console.log("New user created:", newUser);
            return true;
          }

          // Update existing user
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
          console.log("User updated:", updatedUser);
          return true;
        }

        // For credentials sign in
        const existingUser = await User.findOne({ email: user.email });
        return !!existingUser;
      } catch (error) {
        console.error("Error in signIn callback:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Force redirect to onboarding page
      return `${baseUrl}/onboarding`;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
        token.id = user.id;
      }
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