"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { deleteUser, setUser } from "@/store/Reducers/mainUser";

const UserSessionManager = () => {
  const { data } = useSession();
  const user = data?.user as any;
  const dispatch = useDispatch();

  const cachedUser = useSelector((state: RootState) => state.mainUserSlice.user);


  useEffect(() => {
    if (user && !cachedUser) {

      dispatch(setUser(user )); // Cache the user in Redux store
    }

    if (!user && cachedUser) {
      dispatch(deleteUser()); // Clear the user cache on logout
    }
  }, [ cachedUser, dispatch, user]);

  return null;
};

export default UserSessionManager;
