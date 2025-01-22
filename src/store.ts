// module config
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { blogApi } from 'pages/blog/blog.service'
import blogReducer from 'pages/blog/blog.slice'
// ...

export const store = configureStore({
  reducer: {
    // Dat cai key ten la blog
    blog: blogReducer,
    // Tên state hiển thị trên redux thay vì chữ blog ở trên
    // Key                |  reducer được tạo từ createApi
    [blogApi.reducerPath]: blogApi.reducer
  },
  // Thêm api middleware để enable các tính năng như catching, invalidation, polling của rtk-query
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(blogApi.middleware)
})

// Optional nhưng bắt buộc nếu muốn dùng tính năng refetchOnFocus/refetchOnReconnect
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
