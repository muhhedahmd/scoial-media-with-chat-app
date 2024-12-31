import { jwtVerify } from "jose";
import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const jwtConfig = {
  secret: new TextEncoder().encode(process.env.NEXTAUTH_SECRET!),
};

export const ourFileRouter = {
  messageAttachment: f({ image: { maxFileSize: "4MB" }, pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const secret = process.env.NEXTAUTH_SECRET!;

      try {
        const token = await getToken({
          req,
          secret,
          raw: true,
        });

        if (!token) {
          throw new Error("Unauthorized");
        }

        const userx = await jwtVerify(token, jwtConfig.secret);
        
        if (userx.payload && typeof userx.payload.sub === 'string') {
          return { userId: userx.payload.sub };
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        throw new Error("Unauthorized");
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;