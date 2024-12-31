"use client";
import { Button } from "@/components/ui/button";
// import ContactsList from '@/app/chat/_componets/Contacts'
// import prisma from '@/lib/prisma'
import supabase from "@/lib/Supabase";
import { Chat, ChatType, GroupMember } from "@prisma/client";
import React, { memo, useEffect, useState } from "react";
import WebRTCTest from "./videoCall";
import { GroupVideoChat } from "../_comp/VideoChatGroup";
import axios from "axios";
import { useVideoCallStartGroupMutation } from "@/store/api/apiVideoCall";
import { useGetContactsQuery } from "@/store/api/apiChat";

const Contracts = memo(({ userId , userName  }: { userName : string,  userId: number }) => {
  const [contacts, setContacts] = React.useState<Chat[] | []>([]);
  const {data : dataContacts , isLoading  : isLoadingContacts, isError } = useGetContactsQuery({})
  const [select, setselect] = React.useState<{
    id: number;
    type: ChatType;
    creatorId: number;
    createdAt: Date;
    description: string | null;
    name: string | null;
    reciverId: number | null;
    roomId: number | null;
    updatedAt: Date;
    GroupMember: GroupMember[] | null

} | null>(null);
  const [res, setRes] = React.useState<any>();


  const [create, { data, isLoading, error }] = useVideoCallStartGroupMutation();
  
  const createRoomVideoforGroup = async () => {
    try {
      const res = await create({
        chatId: select!.id,
      })
        .unwrap()
        .then((res) => {
          console.log(data);
          console.log(res);
          setRes(data);
        })
        .catch((err) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  console.log({
    contacts ,
    userId
  })
  dataContacts
  isLoadingContacts
  return (
    <div>
{/*       
      <div className="flex justify-start items-center gap-3">

        {dataContacts &&
          dataContacts.map((contract) => {
            return contract.chat.type === "PRIVATE" ? (
              <Button
                onClick={() => {
                  setselect(
                    {
                      ...contract.chat ,
                      GroupMember : contract.members


                    }
                  );
                }}
                className="flex  justify-start items-center"
                key={contract.chat.id}
              >
                <div>
                  <p>contractId: {contract.chat.id}</p>
                  <p>reciverId {contract.chat.reciverId}</p>
                </div>
                <p>creatorId {contract.chat.creatorId}</p>
                <p>roomId {contract.chat.roomId}</p>
                <p>type {contract.chat.type}</p>
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setselect(
                      {
                        ...contract.chat ,
                        GroupMember : contract.members
  
  
                      }
                    );                  }}
                  className="flex  justify-start items-center"
                  key={contract.chat.id}
                >
                  <div>
                  <p>contractId: {contract.chat.id}</p>
                  <p>reciverId {contract.chat.reciverId}</p>
                </div>
                <p>creatorId {contract.chat.creatorId}</p>
                <p>roomId {contract.chat.roomId}</p>
                <p>type {contract.chat.type}</p>
                </Button>
              </>
            );
          })}
      </div> */}

      {select?.type === "PRIVATE" && select.reciverId && select.roomId && (
        
        <div>
          <WebRTCTest
            otherUserId={select.reciverId}
            chatId={select.roomId}
            currentUserId={userId}
          />
        </div>
      )}
      {select?.type === "GROUP" && !select.roomId && select?.GroupMember && (
        <>
          <Button onClick={createRoomVideoforGroup}>
            createRoomVideoforGroup
          </Button>
        </>
      )}

      {select?.type === "GROUP" && select.roomId && select?.GroupMember && (
        <div>
          <GroupVideoChat
          userName={userName}
          chatId={select.id}
       
            roomId={select.roomId}
            currentUserId={userId}

          />
        </div>
      )}
    </div>
  );
});

export default Contracts;
Contracts.displayName = "Contracts";

// <div className="mt-4 flex bg-neutral-50 rounded-lg overflow-hidden">

//   <div className="flex items-center gap-4 w-3/4 bg-neutral-100 p-4">
//     {["Alicia Paddock", "Sri Veronica", "Corbyn Stefan"].map(
//       (name, idx) => (
//         <div key={idx} className="flex flex-col items-center">
//           <div className="h-[40px] w-[40px] bg-emerald-500 rounded-full" />
//           {/* <img
//       src={`https://tools-api.webcrumbs.org/image-placeholder/80/80/avatars/${idx + 1}`}
//       className="rounded-full object-contain"
//       alt={name}

//       width="40"
//       height="40"
//     /> */}
//           <p className="text-sm text-neutral-700 mt-2">{name}</p>
//         </div>
//       )
//     )}
//   </div>

// </div>
