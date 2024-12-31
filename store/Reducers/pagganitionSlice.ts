import { ChatMediaTabsType } from "@/app/api/chat/chat-media-tabs/route";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabData = {
  skip: number;
  take: number;
  stop?: boolean;
};

type TabChatInfoData =  {
  type : ChatMediaTabsType ,
  skip: number;
  take: number;

}
export enum Taps {
  posts,
  media,
  likes,
}

type ProfileTabs = {
  [tab in Taps]: TabData; // Allows any tab (e.g., "posts", "media", "likes") as a key
};

type ProfilesState = {
  profiles: {
    [userId: string]: ProfileTabs;
  };
};

type  LinksTab = {
skip: number;
take: number;
}
type  mediaTab = {
skip: number;
take: number;
}

type FixedResponseTaps 
= {
  link : LinksTab ,
  'video&image' : mediaTab ,
  image : mediaTab ,
  video : mediaTab ,
  others : mediaTab ,
  audio : mediaTab ,
  
  }
  
type PaginationState = {
  posts: TabData;
  replies: TabData;
  comments: TabData;
  followers: TabData;
  following: TabData;
  reactions: TabData;
  mention: TabData;
  multiProfileMain: ProfilesState;
  chatInfoTap : FixedResponseTaps
};

const initialState: PaginationState = {
  posts: { skip: 0, take: 5 },
  replies: { skip: 0, take: 3 },
  comments: { skip: 0, take: 10 },
  followers: { skip: 0, take: 10 },
  following: { skip: 0, take: 10 },
  reactions: { skip: 0, take: 10 },
  mention: { skip: 0, take: 10 },
  chatInfoTap : {
    link : { skip: 0, take: 10 },
    'video&image' : { skip: 0, take: 10 },
    image : { skip: 0, take: 10 },
    video : { skip: 0, take: 10 },
    others : { skip: 0, take: 10 },
    audio : { skip: 0, take: 10 },

  },
  multiProfileMain: {
    profiles: {},
  },
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    setPostsPagination: (state, action: PayloadAction<TabData>) => {
      state.posts.skip = action.payload.skip;
      state.posts.take = action.payload.take;
    },
    setRepliesPagination: (state, action: PayloadAction<TabData>) => {
      state.replies.skip = action.payload.skip;
      state.replies.take = action.payload.take;
    },
    setCommentsPagination: (state, action: PayloadAction<TabData>) => {
      state.comments.skip = action.payload.skip;
      state.comments.take = action.payload.take;
    },
    setFollowersPagination: (state, action: PayloadAction<TabData>) => {
      state.followers.skip = action.payload.skip;
      state.followers.take = action.payload.take;
    },
    setFollowingPagination: (state, action: PayloadAction<TabData>) => {
      state.following.skip = action.payload.skip;
      state.following.take = action.payload.take;
    },
    setReactionsPagination: (state, action: PayloadAction<TabData>) => {
      state.reactions.skip = action.payload.skip;
      state.reactions.take = action.payload.take;
    },
    setMentionPagination: (state, action: PayloadAction<TabData>) => {
      state.mention.skip = action.payload.skip;
      state.mention.take = action.payload.take;
    },
    setChatInfoTapPagination: (state, action: PayloadAction<TabChatInfoData>) => {
      state.chatInfoTap[action.payload.type].skip = action.payload.skip;
      state.chatInfoTap[action.payload.type].take = action.payload.take;
    },
    setPaginationForTab: (
      state,
      action: PayloadAction<{
        userId: string;
        tab: Taps;
        skip?: number;
        take?: number;
        stop?: boolean;
      }>
    ) => {
      const { userId, tab, skip, take, stop } = action.payload;

      if (!state.multiProfileMain.profiles[userId]) {
        state.multiProfileMain.profiles[userId] = {
          [Taps.likes]: {
            skip: 0,
            take: 10,
            stop: false,
          },
          [Taps.media]: {
            skip: 0,
            take: 10,
            stop: false,
          },
          [Taps.posts]: {
            skip: 0,
            take: 10,
            stop: false,
          },
        };
      }
      state.multiProfileMain.profiles[userId][tab] = {
        skip: skip ?? state.multiProfileMain.profiles[userId][tab]?.skip ?? 0,
        take: take ?? state.multiProfileMain.profiles[userId][tab]?.take ?? 10,
        stop:
          stop ?? state.multiProfileMain.profiles[userId][tab]?.stop ?? false,
      };
    },
    
    resetPagination: (state) => {
      Object.assign(state, initialState);
    },
  },
});

// Export actions
export const {
  setMentionPagination,
  setPostsPagination,
  setRepliesPagination,
  setCommentsPagination,
  setFollowersPagination,
  setFollowingPagination,
  setReactionsPagination,
  resetPagination,

  setPaginationForTab,
} = paginationSlice.actions;

// Export the reducer
export default paginationSlice.reducer;
