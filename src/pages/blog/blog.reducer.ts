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

// Tạo action:
// Thêm
export const addPost = createAction<Post>('blog/addPost')

// Xóa
export const deletePost = createAction<string>('blog/deletePost')

//<Post>: là định dạng cho kiểu dữ liệu gửi lên payload

const blogReducer = createReducer(initalState, (builder) => {
  builder
    .addCase(addPost, (state, action) => {
      // immerjs
      // immerjs: giúp cho chúng ta mutate một state an toàn
      const post = action.payload
      state.postList.push(post)
    })
    .addCase(deletePost, (state, action) => {
      // Lấy id từ action. Id nằm trong payload của action
      const postId = action.payload
      // Tìm vịt trí của thằng muốn xóa
      const foundPostIndex = state.postList.findIndex((item) => item.id === postId)
      // Xóa nó theo kiểu mutate luôn
      //*Lưu ý trường hợp không tìm thấy. Nên cần thêm cái if
      //  để chắc chắn rằng tìm thấy
      if (foundPostIndex !== -1) {
        state.postList.splice(foundPostIndex, 1)
      }
    })
})

export default blogReducer

//initalState: giá trị khời tạo của state
//builderCallback: nơi xử lí các action và xử lí cập nhật state
