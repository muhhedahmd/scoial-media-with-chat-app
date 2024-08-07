import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";



export default withAuth(
  async function middleware(Request: NextRequest) {
    console.log(Request.nextUrl.pathname)
    const secret = process.env.NEXTAUTH_SECRET;

    const pathname = Request.nextUrl.pathname;
    const isAuth = await getToken({
      req: Request,
      secret: secret,
      raw: true,
    });
    const ProtectedRoute = [ "/" , "/profile" , "/product" , "/todo" ,"/upload" , "/users"];
    console.log("isAuth" ,isAuth )

    const AuthRoute = pathname.startsWith("/auth");
    const isProtectedRoute = ProtectedRoute.some((route) => {
      return pathname.startsWith(route);
    });
    if (!isAuth && isProtectedRoute) {
      return Response.redirect(new URL("api/auth/signin", Request.url));
    }
    if(isAuth && AuthRoute)
{
  return Response.redirect(new URL("/", Request.url));
}
  },
  {
    callbacks: {
     authorized({token , req}){
     const auth_token =  req.cookies.get("next-auth.session-token")
  //     name: 'next-auth.session-token',
  // value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoibW9oYW1lZCIsImVtYWlsIjoiYXNzaHh4QGdtYWlsLmNvbSIsInN1YiI6IjI4IiwiaWQiOiIyOCIsImlhdCI6MTcyMjk4OTYyMX0.33LDtwOQ3DdAA2gbWJm_0zy6pSvGqiddCtxFs8EVI6U'
      console.log( "middleware", {token   , auth_token})
        return true
    }, 

    },
  }
);
export const config = {
    matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
  };