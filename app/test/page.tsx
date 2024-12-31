"use client"
import { useSelector } from "react-redux";
import { userResponse } from "@/store/Reducers/mainUser";
import { Suspense } from "react";
import Contracts from "./_contacts/Page";

export default function Page() {
  const CachedUser = useSelector(userResponse)!;

  if (!CachedUser) {
    return <>oOps...</>;
  }

  return (
    <>
      <div className="w-screen h-screen flex ">
        <Suspense fallback={<>loading...</>}>
          <Contracts userName={CachedUser.user_name} userId={CachedUser.id} />
        </Suspense>
      </div>
    </>
  );
}
