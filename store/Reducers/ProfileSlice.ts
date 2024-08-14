import { Profile } from "@prisma/client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as jose from "jose";

// Define the Profile type alias (if necessary)

// Define the initial state type
interface ProfileStateResult {
  profileReducer :{

    data: Profile | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
}
interface ProfileState {
  
  data: Profile | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: ProfileState = {
  data: null,
  status: 'idle',
  error: null,
};

// Function to extract user ID from token
async function getUserIdFromToken(token: string): Promise<string> {
  try {
    const jwtConfig = {
      secret: new TextEncoder().encode(process.env.NEXTAUTH_SECRET!)
    };
    const { payload } = await jose.jwtVerify(token, jwtConfig.secret);
    return payload.sub as string; // Assuming 'sub' contains the user ID
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

// Async thunk for fetching profile data
export const fetchProfile = createAsyncThunk('profile/fetch', async (userId: number ) => {
  try {
    // const userId = await getUserIdFromToken(token);
    const response = await axios.get(`http://localhost:3000/api/users/profile/${userId}`);
    console.log(response)
    // Replace with your actual API endpoint
    return response.data as Profile;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
});

// Async thunk for editing profile data
export const editProfile = createAsyncThunk('profile/edit', async ( {userId, profileData }: { userId: number, profileData: FormData }) => {
  try {
    const response = await axios.put(`http://localhost:3000/api/users/UpdateProfile/${userId}`, profileData , {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    }); // Replace with your actual API endpoin
    console.log(response.data)
    return response.data as Profile;
  } catch (err: any) {
    throw err.response?.data || err.message;
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
   
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.status = 'loading';
        state.data = null
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.data = null
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(editProfile.pending, (state) => {
        state.status = 'loading';
        state.data = null
        state.error = null

      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to edit profile';
      });
  },
});

// Selectors


export const selectProfile = (state:ProfileStateResult ) => state.profileReducer.data
export const selectProfileStatus = (state:ProfileStateResult) => state.profileReducer.status
export const selectProfileError = (state: ProfileStateResult) => state.profileReducer.error

// Export actions and reducer
export default profileSlice.reducer;
