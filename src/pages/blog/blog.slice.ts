import { createSlice } from '@reduxjs/toolkit'

interface BlogState {
  postId: string
}

const initialState: BlogState = {
  postId: ''
}

//createSlice
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {}
})

// export
const blogReducer = blogSlice.reducer
export default blogReducer
