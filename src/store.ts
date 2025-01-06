// File dùng để setup rtk cho dự án
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.slice'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: { blog: blogReducer }
})

// Dung cho ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Dùng dispatch cho createAsyncThunk
export const useAppDispatch = () => useDispatch<AppDispatch>()
