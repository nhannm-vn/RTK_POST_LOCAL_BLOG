import { createAction, createReducer } from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
import Post from 'types/blog.type'

// File chua cac state duoc luu trong reducer

interface BlogState {
  postList: Post[]
}

const initalState: BlogState = {
  postList: initalPostList
}

// Tạo action
export const addPost = createAction<Post>('blog/addPost')

//<Post>: là định dạng cho kiểu dữ liệu gửi lên payload

const blogReducer = createReducer(initalState, (builder) => {
  builder.addCase(addPost, (state, action) => {
    // immerjs
    // immerjs: giúp cho chúng ta mutate một state an toàn
    const post = action.payload
    state.postList.push(post)
  })
})

export default blogReducer

//initalState: giá trị khời tạo của state
//builderCallback: nơi xử lí các action và xử lí cập nhật state
