// Tao interface

import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

// initialStates
const initialState: BlogState = {
  postId: ''
}

// createSlice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {}
})

// export cac gia tri
const blogReducer = blogSlice.reducer
export default blogReducer
