import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const URL = "https://jsonplaceholder.typicode.com/posts"


export const  fetchPosts = createAsyncThunk('posts/fetchPosts' , async () => {
  try {

    const response = await  axios.get(URL)
    return response.data
  } catch (error) {
    console.log(error)
  }


  }
)


const initialState = {
  posts: [],
  status: 'idle',
  error: null
}

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    addPost: {
      reducer(state, action) {
        state.push(action.payload);
      },
      prepare(title, content , userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            userId,
            date : new Date().toISOString()
          }
        };
      }
    }
  },
  extraReducers(bulider){
    bulider.addCase(
      fetchPosts.pending, (state , action)=>{
        state.status = 'loading'
      }

    ).addCase(
      fetchPosts.fulfilled, (state , action)=>{
        state.status = 'succeeded'
        let min =  1
        const loadedPosts = action.payload.map((post)=>{
          post.date = sub(new Date() , {minutes : min++} ).toISOString()
          post.reactions = {
            thumbsUp : 0 ,
            hoory : 0 ,
            heart : 0,
            rockets:0,
            eyes : 0 ,

          }
          return post
        })
        state.posts = loadedPosts
      } 
    )
    .addCase(fetchPosts.rejected  ,(state , action)=>{
      state.status = 'failed'
      state.error = action.error.message
    })
  }
});

export const selectAllPosts = (state) => state.posts.posts;
export const selectstatusPosts = (state) => state.posts.status;
export const selecErrorPosts = (state) => state.posts.error;
export default postSlice.reducer;
export const { addPost } = postSlice.actions;


// <Provider
// store={store}
// >

// <App/> 
// </Provider>


// call

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addPost, selectAllPosts  , fetchPosts ,selecErrorPosts ,selectstatusPosts} from './postSlice';
// import { selectAllusers } from '../users/userSlice';
// import Author from './Author';
// import DateAgo from './DateAgo';
// import PostsExcet from './PostsExcet';

// const PostsList = () => {
//   const dispatch = useDispatch();

//   const posts = useSelector(selectAllPosts);
//   const PostStatus =useSelector(selectstatusPosts);
//   const PostError =useSelector(selecErrorPosts);
//   const users = useSelector(selectAllusers);