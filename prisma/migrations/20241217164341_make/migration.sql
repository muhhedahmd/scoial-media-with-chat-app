-- AlterTable
CREATE SEQUENCE videochat_id_seq;
ALTER TABLE "VideoChat" ALTER COLUMN "id" SET DEFAULT nextval('videochat_id_seq');
ALTER SEQUENCE videochat_id_seq OWNED BY "VideoChat"."id";
