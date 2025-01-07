import { AsyncThunk, createAsyncThunk, createSlice, current, nanoid, PayloadAction } from '@reduxjs/toolkit'
// import { initalPostList } from 'constants/blog'
import Post from 'types/blog.type'
import http from 'utils/http'

// File chua cac state duoc luu trong reducer

interface BlogState {
  postList: Post[]
  editingPost: Post | null // giúp nhận biết khi nào edit
  loading: boolean
  currentRequestId: undefined | string
}

const initialState: BlogState = {
  postList: [],
  editingPost: null,
  loading: false, // giúp check khi nào hiển thị skeleton
  currentRequestId: undefined
  // Khi mỗi action pending thực hiện nó sẽ check coi đúng id pending của nó không
  //và mỗi action pending có một id duy nhất. Nếu không nhờ vào thằng id này để check
  //thì nó sẽ bị tình trạng hủy và set loading về false ngay lập tức do mình có cái abort(lúc getPostList)
  //dẫn tới skeleton sẽ không xuất hiện
  //==> giải pháp là mỗi lần pending thì mình sẽ set cái id current vào cho state đó để check trước khi chuyển loading thành false
  //nghĩa là chỉ có thằng action nào có id của pending hiện tại thì mới set state
}

// Định nghĩa ts
// Giúp bổ xung định nghĩa ts
type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

// Tạo action:
// Thêm
// export const addPost = createAction('blog/addPost', function (post: Omit<Post, 'id'>) {
//   return {
//     payload: {
//       ...post,
//       id: nanoid()
//     }
//   }
// })
//<Post>: là định dạng cho kiểu dữ liệu gửi lên payload

// Xóa
// export const deletePost = createAction<string>('blog/deletePost')

// Editing
// export const startEditingPost = createAction<string>('blog/startEditingPost')

// Cancel editing
//_Chỉ cần set lại thằng editingPost của redux là được
// export const cancelEditingPost = createAction('blog/cancelEditingPost')

// Finishediting Post
// export const finishEditingPost = createAction<Post>('blog/finishEditingPost')
// ----------------------------------------------------------

// *Lưu ý phải dùng ở extraReducer
export const getPostList = createAsyncThunk(
  'blog/getPostList', //
  async (_, thunkAPI) => {
    const response = await http.get<Post[]>('posts', {
      // Hủy resend 2 lần
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const addPost = createAsyncThunk(
  'blog/addPost', //
  async (body: Omit<Post, 'id'>, thunkAPI) => {
    const response = await http.post<Post>('posts', body, {
      // Hủy resend 2 lần
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const updatePost = createAsyncThunk(
  'blog/updatePost', //
  async ({ postId, body }: { postId: string; body: Post }, thunkAPI) => {
    const response = await http.put<Post>(`posts/${postId}`, body, {
      // Hủy resend 2 lần
      signal: thunkAPI.signal
    })
    return response.data
  }
)

export const deletePost = createAsyncThunk(
  'blog/deletePost', //
  async (postId: string, thunkAPI) => {
    const response = await http.delete<Post>(`posts/${postId}`, {
      // Hủy resend 2 lần
      signal: thunkAPI.signal
    })
    return response.data
  }
)

// ----------------------------------------------------------
const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    // deletePost: (state, action: PayloadAction<string>) => {
    //   // Lấy id từ action. Id nằm trong payload của action
    //   const postId = action.payload
    //   // Tìm vịt trí của thằng muốn xóa
    //   const foundPostIndex = state.postList.findIndex((item) => item.id === postId)
    //   // Xóa nó theo kiểu mutate luôn
    //   //*Lưu ý trường hợp không tìm thấy. Nên cần thêm cái if
    //   //  để chắc chắn rằng tìm thấy
    //   if (foundPostIndex !== -1) {
    //     state.postList.splice(foundPostIndex, 1)
    //   }
    // },
    startEditingPost: (state, action: PayloadAction<string>) => {
      const postId = action.payload
      // Tìm nó dựa vào Id. Nếu không có thì vẫn cho nó là null
      const foundPost = state.postList.find((post) => post.id === postId) || null
      // Lưu nó vào state editingPost
      state.editingPost = foundPost
    },
    cancelEditingPost: (state) => {
      state.editingPost = null
    }
    // finishEditingPost: (state, action: PayloadAction<Post>) => {
    //   // Lấy id
    //   const postId = action.payload.id
    //   state.postList.find((post, index) => {
    //     if (post.id === postId) {
    //       state.postList[index] = action.payload
    //       return true
    //     }
    //     return false
    //   })
    //   // Sau khi hoàn tất update thì mình cũng làm sạch sẽ cái form
    //   state.editingPost = null
    // }
    // addPost: {
    //   reducer: (state, action: PayloadAction<Post>) => {
    //     // immerjs
    //     // immerjs: giúp cho chúng ta mutate một state an toàn
    //     const post = action.payload
    //     state.postList.push(post)
    //   },
    //   prepare: (post: Omit<Post, 'id'>) => ({
    //     payload: {
    //       ...post,
    //       id: nanoid()
    //     }
    //   })
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(
        getPostList.fulfilled, //
        (state, action) => {
          state.postList = action.payload
        }
      )
      .addCase(
        addPost.fulfilled, //
        (state, action) => {
          // Thêm vào mảng
          state.postList.push(action.payload)
        }
      )
      .addCase(
        updatePost.fulfilled, //
        (state, action) => {
          state.postList.find((post, index) => {
            if (post.id === action.payload.id) {
              state.postList[index] = action.payload
              return true
            }
            return false
          })
          // Sau khi hoàn tất update thì mình cũng làm sạch sẽ cái form
          state.editingPost = null
        }
      )
      .addCase(
        deletePost.fulfilled, //
        (state, action) => {
          state.postList = state.postList.filter((post) => post.id !== action.meta.arg)
        }
      )
      // Nghĩa là cái nào đúng thì làm
      .addMatcher<PendingAction>(
        // Thằng nào mà có trạng thái là pending
        //và có đuôi type action là pending thì làm
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
        }
      )
      .addMatcher<RejectedAction>(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false // tắt skeleton
        }
      )
      .addMatcher<FulfilledAction>(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          state.loading = false // tắt skeleton
        }
      )
      .addDefaultCase((state, action) => {
        console.log(`action type: ${action.type}`, current(state))
      })
  }
})

export const { cancelEditingPost, startEditingPost } = blogSlice.actions
const blogReducer = blogSlice.reducer
export default blogReducer
