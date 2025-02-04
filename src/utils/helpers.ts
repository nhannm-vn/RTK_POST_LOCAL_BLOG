/**
 * Phương pháp "type predicate" dùng để thu hẹp kiểu của một biến
 * ✅ Đầu tiên chúng ta sẽ khai báo một function check kiểm tra cấu trúc về mặc logic javascript
 * ✅ Tiếp theo chúng ta thêm `parameterName is Type` làm kiểu return của function thay vì boolean
 * ✅ Khi dùng function kiểu tra kiểu này, ngoài việc kiểm tra về mặc logic cấu trúc, nó còn chuyển kiểu
 *
 * So sánh với phương pháp ép kiểu "Type Assertions" thì ép kiểu chúng giúp chúng ta đúng về mặc Type, chưa chắc về logic
 *
 */

import { FetchBaseQueryError } from '@reduxjs/toolkit/query'

/**
 * Thu hẹp một error có kiểu không xác định về `FetchBaseQueryError`
 */

// Đây là func return boolean
export function isFetchBaseQueryError(error: unknown): error is FetchBaseQueryError {
  return typeof error === 'object' && error !== null && 'status' in error
}
