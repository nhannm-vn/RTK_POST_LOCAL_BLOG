import { createReducer } from '@reduxjs/toolkit'
import Post from 'types/blog.type'

// File chua cac state duoc luu trong reducer

interface BlogState {
  postList: Post[]
}

const initalState: BlogState = {
  postList: []
}

const blogReducer = createReducer(initalState, (builder) => {})

export default blogReducer

//initalState: giá trị khời tạo của state
//builderCallback: nơi xử lí các action và xử lí cập nhật state
