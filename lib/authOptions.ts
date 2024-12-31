import NextAuth, { AuthOptions, RequestInternal } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import { compare, hash } from "bcrypt";
import axios from "axios";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "sigin",
      name: "Sign In",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        password: { label: "Password", type: "password" },
        user_name: { label: "User name", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/users/Login",
           credentials ,


          );

          if (response.status === 200) {
            console.log("Response Data:", response.data);
            return response.data;
          }
        } catch (error: any) {
          console.log(error.response.data)
          throw new Error(
            JSON.stringify({
              errors: error.response.data,
              status: 400,
              ok: false,
            })
          );

        }
        return null;
      },
    }),
    CredentialsProvider({
      id: "signup",
      name: "Sign Up",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "hello@example.com",
        },
        role: { label: "role", type: "text" },
      },
      async authorize(credentials: Record<string, any> | undefined) {
        console.log("credentials next auth", credentials);
        if(!credentials) return
       const formData = new FormData();

        Object.keys(credentials).map((k) => {
          formData.append(k, credentials[k]);
        });

        try {
          const response = await axios.post(
            "http://localhost:3000/api/users/create",
            credentials,
            {
              headers: {
                // "Content-Type": "application/x-www-form-urlencoded", 
              },
            }
          );

          if (response.status === 201) {
            console.log("Response Data:", response.data);
            return response.data;
          }
        } catch (error: any) {
          console.log(error.response.data)
          throw new Error(
            JSON.stringify({
              errors: error.response.data,
              status: 400,
              ok: false,
            })
          )
        }

        return null;
      },
    }),
  ],

  jwt: {
    async encode({ secret, token }) {
      return jwt.sign(token!, secret);
    },
    async decode({ secret, token }) {
      const decodedToken = jwt.verify(token!, secret) as JwtPayload;
      // console.log('Decoded token:', decodedToken);
      return decodedToken;
    },

    secret: process.env.JWT_SECRET!,
  },
  callbacks: {
    async jwt({ token, user }) {
      // console.log("User Data in JWT:", user, token); // Debug log
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      // console.log("Session Token:", token, session, user); // Debug log
      session.user = token;
      return session;
    },
    async redirect({ url, baseUrl }) {
      // console.log(url, baseUrl);
      // Redirect users to the home page after sign in/sign up
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    newUser: "/signup",
    signOut: "/signout",
    error: "/error",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};
