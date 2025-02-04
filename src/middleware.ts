// Đây là middleware của redux

import { isRejected, isRejectedWithValue, Middleware, MiddlewareAPI } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

// Dùng để check lỗi chính xác và hiển thị lên bằng toastify
// Xài kỹ thuật Predicate Type để mong muốn chính xác type của nó
function isPayloadErrorMessage(payload: unknown): payload is {
  data: {
    error: string
  }
  status: number
} {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'data' in payload &&
    typeof (payload as any).data?.error === 'string'
  )
}
// Thằng này dùng để check chính xác lỗi có error là string

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  /**
   * `isRejectedWithValue` là một function giúp chúng ta kiểm tra những action có rejectedWithValue = true từ createAsyncThunk
   * RTK Query sử dụng `createAsyncThunk` bên trong nên chúng ta có thể dùng `isRejectedWithValue` để kiểm tra lỗi 🎉
   */
  // Option: chứ trong thực tế thì không cần bắt buột
  if (isRejected(action)) {
    if (action.error.name === 'CustomError') {
      // Những lỗi liên quan đến quá trình thực thi(viết code) hay còn gọi là Senzialine
      toast.warn(action.error.message)
    }
  }
  if (isRejectedWithValue(action)) {
    // Mỗi khi thực hiện query hoặc mutation mà bị lỗi thì nó sẽ chạy vào đây
    // Những lỗi từ server thì action nó mới có rejectedWithValue = true
    // Còn những action liên quan đến việc caching mà bị rejected thì rejectedWithValue = false,
    // nên đừng lo lắng, nó không lọt vào đây được

    // Check thử coi nếu lỗi mà payload là string check bằng hàm ở trên
    if (isPayloadErrorMessage(action.payload)) {
      // Lỗi reject từ server chỉ có message thôi. Còn những lỗi mà còn lại
      //thì thông báo khác
      toast.warn(action.payload.data.error)
    }
  }
  // Khi khai bao middleware thi cần next để đi tiếp tầng tiếp theo
  return next(action)
}
