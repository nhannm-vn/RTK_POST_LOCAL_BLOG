// File dùng để setup rtk cho dự án
import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'pages/blog/blog.reducer'

export const store = configureStore({
  reducer: { blog: blogReducer }
})

// Dung cho ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
