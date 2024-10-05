import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@prisma/client"; // Assuming you're using Prisma's User model
import { RootState } from "../store";

// Define the slice
export const mainUserSlice = createSlice({
  name: "main_user",
  initialState: {
    user: null as User | null,
    isLoading : false ,
  },
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; 
    },

    // Action to edit the user
    editUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }; // Update the user data
      }
    },

 
    deleteUser: (state) => {
      state.user = null; // Clear the user from the state
    },
  },
});

export const { setUser, editUser, deleteUser } = mainUserSlice.actions;
export default mainUserSlice.reducer;

export const userResponse =  (state : RootState)=> state.mainUserSlice.user; // Assuming you're using Redux Toolkit
export const isLoading =  (state : RootState)=> state.mainUserSlice.user; // Assuming you're using Redux Toolkit
