// File dùng để setup rtk cho dự án
import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {}
})

// Dung cho ts
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
