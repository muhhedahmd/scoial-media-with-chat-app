import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper'; // Optional if using with Next.js
import follwerSlice from './Reducers/follwerSlice';
import { apiSlice } from './api/apiSlice';
import { apiProfile } from './api/apiProfile';
import { apiUser } from './api/apiUser';
import { followApi } from './api/apiFollows';
import pagganitionSlice from './Reducers/pagganitionSlice';
import { commentApi } from './api/apicomment';
import { NotifcationApi } from './api/apiNotifcation';
import { apiSave } from './api/apiSave';
import mainUserSlice  from './Reducers/mainUser';
// Create the store instance
export const makeStore = () => {
  return configureStore({
    reducer: {
      [apiSlice.reducerPath] : apiSlice.reducer ,
      [apiProfile.reducerPath] : apiProfile.reducer,
      [apiUser.reducerPath] : apiUser.reducer,
      [followApi.reducerPath] :followApi.reducer,
      [commentApi.reducerPath] :commentApi.reducer,
      [NotifcationApi.reducerPath] :NotifcationApi.reducer,
      pagination : pagganitionSlice,
      followersReducer: follwerSlice ,
      mainUserSlice :mainUserSlice,
      [apiSave.reducerPath] :  apiSave.reducer
      // Add your reducers here
      // Example: user: userReducer, products: productsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(
        // {
      //   serializableCheck: {
      //     // Ignore these action types
      //     ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      //     // Ignore these field paths in all actions
      //     // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
      //     // // Ignore these paths in the state
      //     // ignoredPaths: ['items.dates'],
      //   },
      // }
    )
    .concat(apiSlice.middleware)
    .concat(apiProfile.middleware)
    .concat(apiUser.middleware)
    .concat(followApi.middleware)
    .concat(commentApi.middleware)
    .concat(NotifcationApi.middleware)
    .concat(apiSave.middleware)
    // Optional middleware configuration
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(serializableCheck({
    //   ignoredActions: ['persist/PERSIST'], // ignore the PERSIST action
    // })),
  
  
  });
};

// Create a store instance to infer the types
const store = makeStore();

// Infer the `RootState`, `AppDispatch`, and `AppStore` types from the store instance
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
// Optional: create a Next.js wrapper for the store
export const wrapper = createWrapper<AppStore>(makeStore);