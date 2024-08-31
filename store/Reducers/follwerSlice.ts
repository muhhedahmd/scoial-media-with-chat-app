import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { Follows, User } from '@prisma/client';

// Define types for API responses
type fetchFollwer_folling_type = {
  profileFollwer: {
    followers: Follows[];
    following: Follows[];
  };
};
type fetch_Suggestion_type = {
  // profileFollwer: {
    Suggestion: {
      email: string;
      first_name: string;
      last_name: string;
      user_name: string;
      profile: {
          profile_picture: string | null;
          cover_picture: string | null;
          birthdate: Date | null;
      } | null;
  }[];
  // };
};

type fetchFollwer_folling_count_type = {
  profileFollwer: {
    _count: {
      followers: number;
      following: number;
    };
  };
};

// Define the state type
interface followsState {
  
  data: {
    followers: Follows[];
    Suggestion: {
      email: string;
      first_name: string;
      last_name: string;
      user_name: string;
      profile: {
          profile_picture: string | null;
          cover_picture: string | null;
          birthdate: Date | null;
      } | null;
  }[];
    following: Follows[];
    follwerCount: number | undefined;
    follwingCount: number | undefined;
  } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Define the initial state
const initialState: followsState = {
  data: null,
  status: 'idle',
  error: null,
};

// Define action types as constants
const FETCH_FOLLOWERS = 'fetch/followers';
const FETCH_FOLLOWING = 'fetch/following';
const FETCH_FOLLOWERS_AND_FOLLOWING_COUNT = 'fetch/followers_and_following_count';
const FETCH_SUGGESTION_FOLLOWERS = 'fetch/fetchSuggetionFollowers';

// Define async thunk functions
export const fetchSuggetionFollowers = createAsyncThunk<fetch_Suggestion_type, { userId: number }>(
  FETCH_SUGGESTION_FOLLOWERS,
  async ({ userId }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/suggestionfollower/${userId}`);
      console.log(res.data)
      return res.data 

    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

export const fetchFollowers = createAsyncThunk<fetchFollwer_folling_type, { userId: number }>(
  FETCH_FOLLOWERS,
  async ({ userId }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/getfollwers/${userId}`);
      console.log(res.data)
      return res.data;

    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

export const fetchFollowing = createAsyncThunk<fetchFollwer_folling_type, { userId: number }>(
  FETCH_FOLLOWING,
  async ({ userId }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/users/getfollwing/${userId}`);
      console.log(res.data)
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  }
);

export const fetchFollowersAndFollowingCount = createAsyncThunk<
  fetchFollwer_folling_count_type,
  { userId: number }
>(FETCH_FOLLOWERS_AND_FOLLOWING_COUNT, async ({ userId }) => {
  try {
    const res = await axios.get(`http://localhost:3000/api/users/getfollowscount/${userId}`);
    console.log(res.data)
    return res.data;

  } catch (error: any) {
    throw error.response?.data || error.message;
  }
});
const followersSlice = createSlice({
  name: 'followers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchFollowers actions
      .addCase(fetchFollowers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = {
          Suggestion: state.data?.Suggestion || [],
          followers: action.payload.profileFollwer.followers,
          following: state.data?.following || [],
          follwerCount: state.data?.follwerCount,
          follwingCount: state.data?.follwingCount,
        };
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch followers';
      })
      // Handle fetchFollowing actions
      .addCase(fetchFollowing.pending, (state) => {
        state.status = 'loading';
      })
 
.addCase(fetchFollowing.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.data = {
    
    followers: state.data?.followers || [],
    following: action.payload.profileFollwer.following,
    follwerCount: state.data?.follwerCount,
    follwingCount: state.data?.follwingCount,
    Suggestion: state.data?.Suggestion || [],
  };
})
.addCase(fetchFollowing.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message || 'Failed to fetch following';
})
// Handle fetchFollowersAndFollowingCount actions
.addCase(fetchFollowersAndFollowingCount.pending, (state) => {
  state.status = 'loading';
})
.addCase(fetchFollowersAndFollowingCount.fulfilled, (state, action) => {
  state.status = 'succeeded';
  state.data = {
    follwerCount: action.payload.profileFollwer._count.followers,
    follwingCount: action.payload.profileFollwer._count.following,
    followers: state.data?.followers || [],
    following: state.data?.following || [],
    Suggestion: state.data?.Suggestion || [],

  };
})
.addCase(fetchFollowersAndFollowingCount.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message || 'Failed to fetch followers and following count';
})
.addCase(fetchSuggetionFollowers.pending , (state  , action)=>{
  state.status = "loading"
})
.addCase(fetchSuggetionFollowers.fulfilled , (state  , action)=>{
  console.log({payload:action.payload})
  state.status = "succeeded"
  state.data = {
    followers : state.data?.followers || [],
    following : state.data?.following || [],
    follwerCount  :state.data?.follwerCount || 0,
    follwingCount:state.data?.follwingCount || 0,
    Suggestion:action.payload.Suggestion|| []
  }
}).addCase(fetchSuggetionFollowers.rejected, (state, action) => {
  state.status = 'failed';
  state.error = action.error.message || 'Failed to fetch Suggestions';
})

},
});


interface followsStateRes {
  followersReducer : {

    data: {
      followers: Follows[];
      following: Follows[];
      Suggestion: {
        email: string;
        first_name: string;
        last_name: string;
        user_name: string;
        profile: {
            profile_picture: string | null;
            cover_picture: string | null;
            birthdate: Date | null;
        } | null;
    }[] ,
      follwerCount: number | undefined;
      follwingCount: number | undefined;
    } | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
  }
}

// Export selectors
export const selectFollowers = (state: followsStateRes) => state?.followersReducer.data?.followers;
export const selectAll = (state: followsStateRes) => state
export const selectSuggestions = (state: followsStateRes) => state?.followersReducer.data?.Suggestion;
export const selectFollowing = (state: followsStateRes) => state.followersReducer.data?.following;
export const selectFollowersCount = (state: followsStateRes) => state.followersReducer.data?.follwerCount;
export const selectFollowingCount = (state: followsStateRes) => state.followersReducer.data?.follwingCount;
export const selectFollowersStatus = (state: followsStateRes) => state.followersReducer.status;
export const selectFollowersError = (state:followsStateRes) => state.followersReducer.error;

// Export actions and reducer
export default followersSlice.reducer;