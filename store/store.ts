import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper'; // Optional if using with Next.js
import ProfileSlice from './Reducers/ProfileSlice';
// import { serializableCheck } from '@reduxjs';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
// Create the store instance
export const makeStore = () => {
  return configureStore({
    reducer: {
      profileReducer: ProfileSlice, // Add your reducers here
      
      // Example: user: userReducer, products: productsReducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          // Ignore these action types
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          // Ignore these field paths in all actions
          // ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
          // // Ignore these paths in the state
          // ignoredPaths: ['items.dates'],
        },
      }),
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