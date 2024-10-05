import { useGetUserQuery } from "@/store/api/apiUser";
import { Skeleton } from "@nextui-org/react";
import React from "react";
import TimeStamp from "../PostContainerComponsnts/CommentComp/TimeStamp";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { NotificationType } from "@prisma/client";
function getNotificationContent(
  type: NotificationType,
  userName: string
): string {
  const notificationMessages: Record<NotificationType, string> = {
    [NotificationType.MENTION]: `mentioned you in a post as ${userName}`,
    [NotificationType.LIKE]: `liked your post as ${userName}`,
    [NotificationType.COMMENT]: `commented on your post as ${userName}`,
    [NotificationType.REPLAY]: `replied to your comment as ${userName}`,
    [NotificationType.POST_REACT]: `reacted to your post as ${userName}`,
    [NotificationType.FOLLOW]: `started following you as ${userName}`,
    [NotificationType.FOLLOW_BACK]: `followed you back as ${userName}`,
    [NotificationType.UNFOLLOW]: `unfollowed you as ${userName}`,
    [NotificationType.BLOCK]: `blocked you as ${userName}`,
    [NotificationType.SHARE]: `shared your post as ${userName}`,
    [NotificationType.SYSTEM]: `system notification: ${userName}`,
    [NotificationType.MENTION_POST]: `mentioned you in a post as ${userName}`,
    [NotificationType.MENTION_COMMENT]: `mentioned you in a comment as ${userName}`,
    [NotificationType.MENTION_REPLAY]: `mentioned you in a reply as ${userName}`,
    [NotificationType.REPLAY_IN_REPLAY]: `replied to your reply as ${userName}`,
    [NotificationType.REPLY_REACT_AUTHOR]: `reacted to a reply on your post as ${userName}`,
    [NotificationType.REPLY_REACT_COMMENTER]: `reacted to your reply as ${userName}`,
    [NotificationType.COMMENT_REACT_AUTHOR]: `reacted to a comment on your post as ${userName}`,
    [NotificationType.COMMENT_REACT_COMMENTER]: `reacted to your comment as ${userName}`,
    COMMENT_REACT: "",
    REPLAY_REACT: "",
  };

  return notificationMessages[type] || `Notification from ${userName}`;
}

const NotifcationHeader = ({
  notifierId,
  createdAt,
  type,
}: {
  notifierId: number;
  createdAt: Date;
  type: NotificationType;
}) => {
  const { data, isLoading, isFetching } = useGetUserQuery({
    userId: +notifierId,
  });
  if (isLoading || isFetching) {
    return (
      <div className="flex justify-start w-full items-center gap-3">
        <Skeleton className="min-w-12 rounded-full min-h-12 bg-gray-300 " />
        <div className="flex w-full justify-between items-start  gap-2 flex-row">
          <Skeleton className="w-2/3 h-2 bg-gray-300" />
          <Skeleton className="w-1/5 h-2 bg-gray-300" />
        </div>
      </div>
    );
  } else {
    return (
      <>
        <div className="flex justify-start w-full items-start gap-3">
          {data?.profile?.profile_picture ? (
            <Image
              alt={`${data?.first_name} ${data?.last_name} Profile Picture`}
              quality={70}
              src={data.profile?.profile_picture || ""}
              width={40}
              height={40}
              className="p-1 object-cover w-14 rounded-full h-14 bg-gray-100 "
            />
          ) : (
            <div className="min-w-12 rounded-full h-12 bg-gray-300  flex justify-center items-center cursor-pointer">
              <UserIcon />
            </div>
          )}

          <div className="flex w-full  justify-between items-start  gap-2 flex-col">
            <p className="min-w-max font-semibold ">
              {`${data?.first_name} ${data?.last_name}`}
            </p>
            <div className=" -mt-2">
              {getNotificationContent(type, data?.user_name || "")}
            </div>
          </div>

          <TimeStamp created_at={createdAt} />
        </div>
      </>
    );
  }
};

export default NotifcationHeader;
