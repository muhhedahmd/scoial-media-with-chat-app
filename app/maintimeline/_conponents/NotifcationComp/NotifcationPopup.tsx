import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@nextui-org/react";

import { mentionType, Notification, NotificationType, User } from "@prisma/client";
import { Bell, Dot } from "lucide-react";
import React from "react";
import {
  HeaderPostLoader,
  HeaderPostLoaderNotifaction,
} from "../PostContainerComponsnts/postCompoenets/Loaderes";
import {
  useGetNotifcationQuery,
  useLazyGetNotifcationQuery,
} from "@/store/api/apiNotifcation";
import NotifcationHeader from "./NotifcationHeader";
import { Skeleton } from "@/components/ui/skeleton";

function getNotificationColors(notificationType: NotificationType): {
  flatColor: string;
  textColor: string;
} {
  const colors: Record<
    NotificationType,
    { flatColor: string; textColor: string }
  > = {
    [NotificationType.MENTION]: {
      flatColor: "#00a3e473",
      textColor: "#FFFFFF",
    },
    [NotificationType.LIKE]: { flatColor: "#ff562257", textColor: "#FFFFFF" },
    [NotificationType.COMMENT]: {
      flatColor: "#4caf4f60",
      textColor: "#FFFFFF",
    },
    [NotificationType.REPLAY_IN_REPLAY]: {
      flatColor: "#3F51B5",
      textColor: "#FFFFFF",
    },
    [NotificationType.FOLLOW]: { flatColor: "#FF9800", textColor: "#FFFFFF" },
    [NotificationType.FOLLOW_BACK]: {
      flatColor: "#8BC34A",
      textColor: "#FFFFFF",
    },
    [NotificationType.UNFOLLOW]: { flatColor: "#F44336", textColor: "#FFFFFF" },
    [NotificationType.BLOCK]: { flatColor: "#607D8B", textColor: "#FFFFFF" },
    [NotificationType.SHARE]: { flatColor: "#00BCD4", textColor: "#FFFFFF" },
    [NotificationType.SYSTEM]: { flatColor: "#9E9E9E", textColor: "#000000" },
    [NotificationType.MENTION_POST]: {
      flatColor: "#e91e6242",
      textColor: "#FFFFFF",
    },
    [NotificationType.MENTION_COMMENT]: {
      flatColor: "#FF5722",
      textColor: "#FFFFFF",
    },
    [NotificationType.MENTION_REPLAY]: {
      flatColor: "#00A4E4",
      textColor: "#FFFFFF",
    },
    [NotificationType.POST_REACT]: {
      flatColor: "#3F51B5",
      textColor: "#FFFFFF",
    },
    [NotificationType.COMMENT_REACT_AUTHOR]: {
      flatColor: "#9b27b058",
      textColor: "#FFFFFF",
    },
    [NotificationType.COMMENT_REACT_COMMENTER]: {
      flatColor: "#9b27b058",
      textColor: "#FFFFFF",
    },
    [NotificationType.REPLY_REACT_AUTHOR]: {
      flatColor: "#ffc1075a",
      textColor: "#000000",
    },
    [NotificationType.REPLY_REACT_COMMENTER]: {
      flatColor: "#ffc1075a",
      textColor: "#000000",
    },
    COMMENT_REACT: {
      flatColor: "",
      textColor: "",
    },
    REPLAY_REACT: {
      flatColor: "",
      textColor: "",
    },
    REPLAY: {
      flatColor: "",
      textColor: "",
    },
  };

  return (
    colors[notificationType] || { flatColor: "#CCCCCC", textColor: "#000000" }
  );
}

const NotifcationPopup = ({
  Notifcations,
isLoading,
isFetching,
  user,
  fetchNotifcation,
}: {
  Notifcations :Notification[] | undefined
isLoading : boolean
isFetching: boolean
  fetchNotifcation: any;
  user: User | null;
}) => {
  // const {
  //   data: Notifcations,
  //   isLoading,
  //   isFetching,
  // } =  useLazyGetNotifcationQuery({
  //   skip: 0,
  //   take: 10,
  //   userId: user?.id,
  // });

  const handleClick = () => {
    if (user?.id)
      fetchNotifcation({
        skip: 0,
        take: 10,
        userId: user?.id,
      });
  };

  const Len = Notifcations?.filter((e) => e.read === false).length;
  return (
    <Popover offset={10} showArrow>
      <PopoverTrigger>
        <div
        onClick={handleClick}
          className="relative flex  justify-center items-center">
          {Len && (
            <span
              className="
      h-auto
      text-[12px]
      w-auto px-2 left-[55%] top-[17px] text-sm rounded-full 
      absolute  border-1 bg-destructive text-white   "
            >
              {Len > 9 ? +9 : Len}
            </span>
          )}
          <div className="p-4  flex justify-center items-center">
            <Bell className="w-5 h-5" />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div
          style={{
            width: "26rem",
            height: "30rem",
          }}
          className=" flex overflow-y-auto gap-3  overflow-x-hidden flex-col justify-start w-full items-start p-1 rounded-md  "
        >
          {isLoading || isFetching || !user?.id
            ? Array.from({ length: 10 }).map((a, i) => {
                return (
                  <div
                    key={i}
                    className="flex flex-col items-start justify-start p-2  w-full gap-3  border-2 rounded-md"
                  >
                    <HeaderPostLoaderNotifaction />
                  </div>
                );
              })
            :Notifcations&& Notifcations?.map((notfi) => {
                return (
                  <div
                    style={{}}
                    key={notfi.id}
                    className=" relative w-full flex justify-start items-center   gap-3"
                  >
                    <NotifcationHeader
                      notifierId={notfi.notifierId}
                      type={notfi.type}
                      createdAt={notfi.createdAt}
                    />

                    <Dot
                      style={{
                        top: "50%",
                        left: "95%",
                        transform: "translate(-50%  ,-50%)",
                        color: getNotificationColors(notfi.type).flatColor,
                      }}
                      className=" absolute w-10 h-10"
                    />
                  </div>
                );
              })}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotifcationPopup;
