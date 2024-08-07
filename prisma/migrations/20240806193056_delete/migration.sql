-- DropForeignKey
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_category_id_fkey";

-- DropForeignKey
ALTER TABLE "category_post" DROP CONSTRAINT "category_post_post_id_fkey";

-- DropForeignKey
ALTER TABLE "category_post_User" DROP CONSTRAINT "category_post_User_category_post_id_fkey";

-- DropForeignKey
ALTER TABLE "category_post_User" DROP CONSTRAINT "category_post_User_user_id_fkey";

-- DropForeignKey
ALTER TABLE "post" DROP CONSTRAINT "post_author_id_fkey";

-- AddForeignKey
ALTER TABLE "post" ADD CONSTRAINT "post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post" ADD CONSTRAINT "category_post_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post_User" ADD CONSTRAINT "category_post_User_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_post_User" ADD CONSTRAINT "category_post_User_category_post_id_fkey" FOREIGN KEY ("category_post_id") REFERENCES "category_post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
