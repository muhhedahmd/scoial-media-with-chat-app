import { createSlice, PayloadAction } from '@reduxjs/toolkit/react';

interface UiState {
  isPopoverOpen: boolean;
}

const initialState: UiState = {
  isPopoverOpen: false,
};

 const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setPopoverOpen: (state, action: PayloadAction<boolean>) => {
      state.isPopoverOpen = action.payload;
    },
  },
});

export const { setPopoverOpen  } = uiSlice.actions;
export default uiSlice.reducer;
