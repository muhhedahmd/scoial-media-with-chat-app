import NextAuth, { AuthOptions } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare, hash } from "bcrypt";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "signin",
      name: "Sign In",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password) return null;

        const userPrisma = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (userPrisma) {
          const isValidPassword = await compare(credentials.password, userPrisma.password);
          if (isValidPassword) {
            return {
              id: userPrisma.id.toString(),
              name: userPrisma.first_name,
              email: userPrisma.email,
            };
          }
        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "hello@example.com" },
        first_name: { label: "First Name", type: "text", placeholder: "John" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials.password || !credentials.first_name) return null;

        const userPrisma = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (userPrisma) {
          return null; // User already exists
        }

        const user = await prisma.user.create({
          data: {
            first_name: credentials.first_name,
            email: credentials.email,
            password: await hash(credentials.password, 10),
          },
        });

        return {
          id: user.id.toString(),
          name: user.first_name,
          email: user.email,
        };
      },
    }),
  ],
  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token!, secret);
    },
    async decode({ secret, token }) {
      return jwt.verify(token!, secret) as JwtPayload;
    },
    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        Object.assign(token, user);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        Object.assign(session.user!, token.user);
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      console.log(url  ,baseUrl)
      // Redirect users to the home page after sign in/sign up
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "api/auth/signin",
    newUser: "api/auth/signup",
    error: "api/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET!,
};

