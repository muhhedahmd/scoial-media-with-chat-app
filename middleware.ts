import { decode, getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";
import { User } from "@prisma/client";

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXTAUTH_SECRET)!,
};

export default withAuth(
  async function middleware(Request: NextRequest) {
    console.log("test 1 ")
    const secret = process.env.NEXTAUTH_SECRET!;

    const pathname = Request.nextUrl.pathname;
    const isAuth = await getToken({
      req: Request,
      secret: secret,
      raw: true,
    });

    const ProtectedRoute = ["/product","/profile" ,
      // "/api" ,
       "/maintimeline",  "/todo", "/upload", "/users" , "/posts"];
    const AuthRoute = pathname.startsWith("/api/auth");
    const isProtectedRoute = ProtectedRoute.some((route) => {
      return pathname.startsWith(route);
    });

    if (isAuth && pathname.includes("/auth")) {
      return NextResponse.redirect(new URL("/", Request.url));
    }

    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(new URL("auth/signin", Request.url));
    }

    console.log({
      isAuth ,
      pathname ,
      isProtectedRoute
    })
    if (isAuth  && pathname.startsWith("/auth")) {
            return NextResponse.redirect(new URL("/", Request.url));

    }

    if (isAuth && AuthRoute) {
      return NextResponse.next();
      // const tokenData = (await jose.jwtVerify(isAuth, jwtConfig.secret)).payload as User;
      // if (!tokenData.isCompleteProfile && pathname !== "/profile" && pathname !== "/" && !pathname.startsWith("/api"))  {
      //   // If profile is not complete, redirect to profile page
      //   return NextResponse.redirect(new URL("/profile", Request.url));
      // } else if (AuthRoute && tokenData.payload.isCompleteProfile  && pathname !== "/") {
      //   // If profile is complete and user is on auth route, redirect to homepage
      //   return NextResponse.redirect(new URL("/", Request.url));
      // }
    } 
  
  },
  {
    callbacks: {
      authorized({ token, req }) {
        console.log("Authorizedmethotoken"  ,token)
        console.log("req"  ,JSON.stringify(req))
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", "/api/auth(.*)"],
};

//   console.log(tokenData)
//  if (
//   isAuth && isProtectedRoute
// )
// {
//   console.log("edkwdf")
//   return NextResponse.redirect(new URL("/", Request.url));

// }