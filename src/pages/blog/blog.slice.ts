import { createSlice, PayloadAction } from '@reduxjs/toolkit'

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
  reducers: {
    // Mình sẽ thực hiện hai action startEditPost và cancelEditPost trong này vì nó không
    //liên quan gì đến api cả
    startEditPost: (state, action: PayloadAction<string>) => {
      state.postId = action.payload
    },
    cancelEditPost: (state) => {
      state.postId = ''
    }
  }
})

// export
const blogReducer = blogSlice.reducer
export default blogReducer
// export action
export const { startEditPost, cancelEditPost } = blogSlice.actions
