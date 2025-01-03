import { createAction, createReducer, current } from '@reduxjs/toolkit'
import { initalPostList } from 'constants/blog'
import Post from 'types/blog.type'

// File chua cac state duoc luu trong reducer

interface BlogState {
  postList: Post[]
  editingPost: Post | null // giúp nhận biết khi nào edit
}

const initalState: BlogState = {
  postList: initalPostList,
  editingPost: null
}

// Tạo action:
// Thêm
export const addPost = createAction<Post>('blog/addPost')
//<Post>: là định dạng cho kiểu dữ liệu gửi lên payload

// Xóa
export const deletePost = createAction<string>('blog/deletePost')

// Editing
export const startEditingPost = createAction<string>('blog/startEditingPost')

// Cancel editing
//_Chỉ cần set lại thằng editingPost của redux là được
export const cancelEditingPost = createAction('blog/cancelEditingPost')

// Finishediting Post
export const finishEditingPost = createAction<Post>('blog/finishEditingPost')

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
    .addCase(startEditingPost, (state, action) => {
      const postId = action.payload
      // Tìm nó dựa vào Id. Nếu không có thì vẫn cho nó là null
      const foundPost = state.postList.find((post) => post.id === postId) || null
      // Lưu nó vào state editingPost
      state.editingPost = foundPost
    })
    .addCase(cancelEditingPost, (state) => {
      state.editingPost = null
    })
    .addCase(finishEditingPost, (state, action) => {
      // Lấy id
      const postId = action.payload.id
      state.postList.find((post, index) => {
        if (post.id === postId) {
          state.postList[index] = action.payload
          return true
        }
        return false
      })
      // Sau khi hoàn tất update thì mình cũng làm sạch sẽ cái form
      state.editingPost = null
    })
    // Nếu như cái func đầu trả ra true thì callback đằng sau mới bắt đầu chạy
    .addMatcher(
      (action) => action.type.includes('cancel'),
      (state, action) => {
        console.log(current(state))
      }
    )
})

export default blogReducer

//initalState: giá trị khời tạo của state
//builderCallback: nơi xử lí các action và xử lí cập nhật state
