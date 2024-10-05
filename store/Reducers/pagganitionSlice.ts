import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  posts: { skip: 0, take: 5 },
  replies: { skip: 0, take: 3 },
  comments: { skip: 0, take: 10 },
  followers: { skip: 0, take: 10 },
  following: { skip: 0, take: 10 },
  reactions: { skip: 0, take: 10 },
  mention: { skip: 0, take: 10 },
};

const paginationSlice = createSlice({
  name: 'pagination',
  initialState,
  reducers: {
    setPostsPagination: (state, action) => {
      state.posts.skip = action.payload.skip;
      state.posts.take = action.payload.take;
    },
    setRepliesPagination: (state, action) => {
      state.replies.skip = action.payload.skip;
      state.replies.take = action.payload.take;
    },
    setCommentsPagination: (state, action) => {
      state.comments.skip = action.payload.skip;
      state.comments.take = action.payload.take;
    },
    setFollowersPagination: (state, action) => {
      state.followers.skip = action.payload.skip;
      state.followers.take = action.payload.take;
    },
    setFollowingPagination: (state, action) => {
      state.following.skip = action.payload.skip;
      state.following.take = action.payload.take;
    },
    setReactionsPagination: (state, action) => {
      state.reactions.skip = action.payload.skip;
      state.reactions.take = action.payload.take;
    },
    setMentionPaggnation: (state, action) => {
      state.mention.skip = action.payload.skip;
      state.mention.take = action.payload.take;
    },
    resetPagination: (state) => {
      // Reset all pagination counters to the initial state
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setMentionPaggnation,
  setPostsPagination :setPostsPagination ,
  setRepliesPagination,
  setCommentsPagination,
  setFollowersPagination,
  setFollowingPagination,
  setReactionsPagination,
  resetPagination,
} = paginationSlice.actions;

// Export the reducer
export default paginationSlice.reducer;
