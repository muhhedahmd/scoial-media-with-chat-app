import { AuthOptions } from "next-auth";
import jwt, { JwtPayload } from "jsonwebtoken";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { userWithProfile } from "@/Types";

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
            credentials,
          );
          if (response.status === 200) {
            // console.log("Response Data:", response.data);
            return response.data;
          }
        } catch (error: any) {
          return null
          console.log(error.response.data)
          // throw new Error(
          //   JSON.stringify({
          //     errors: error.response.data,
          //     status: 400,
          //     ok: false,
          //   })
          // );

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
        if (!credentials) return
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
            return response.data as userWithProfile;
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
      if (!token) return null
      try {
        const decodedToken = jwt.verify(token, secret)
        return decodedToken as JwtPayload
      } catch (error) {
        console.error("JWT decode error:", error)
        return null
      }
    },

    secret: process.env.JWT_SECRET!,
  },

  callbacks: {

    async jwt({ token, user, trigger, session }) {
      // console.log("JWT Callback triggered:", { trigger, hasUser: !!user, hasSession: !!session })

      // When user signs in, add user data to token
      if (user) {
        // console.log("JWT Callback - User sign in:", user)

        try {
          const response = await axios.post(
            "http://localhost:3000/api/users/handleSession",
            { userId: user.id },
            {
              headers: {
                "Content-Type": "application/json",
              },
            },
          )

          // console.log("Session data fetched during sign-in:", response.data)

          return {
            ...token,
            ...user,
            ...response.data,
          }
        } catch (error) {
          // console.error("Error fetching session data during sign-in:", error)
          return { ...token, ...user }
        }
      }

      // Handle session updates triggered by update() function
      if (trigger === "update" && session) {
        // console.log("JWT Callback - Session update triggered:", session)

        // Merge the updated session data into the token
        return {
          ...token,
          ...session.user, // Update with the new user data including session
        }
      }

      // Return existing token if no updates needed
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          first_name: token.first_name,
          last_name: token.last_name  ,
          user_name: token.user_name  ,
          gender: token.gender        ,
          role: token.role            ,
          expiresAt: token.expiresAt,
          isPrivate: token.isPrivate,
          created_at: token.created_at,
          updated_at: token.updated_at,
          timezone: token.timezone,
          is_2FA: token.is_2FA,
          is_verified: token.is_verified,
          profile: token.profile,
        }

        // Store database session information under session.user.session
        if (token.session) {
          session.user.session = token.session
        }
      }

      // console.log("Session Callback - Final session:", session)
      return session
    },

    async redirect({ url, baseUrl }) {
      return baseUrl
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 1 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
    signOut: "/signout",
    error: "/error",
  },


  secret: process.env.NEXTAUTH_SECRET!,
};
