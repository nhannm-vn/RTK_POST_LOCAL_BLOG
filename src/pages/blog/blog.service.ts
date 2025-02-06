// import
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Post from 'types/blog.type'
import { CustomError } from 'utils/helpers'

export const blogApi = createApi({
  reducerPath: 'blogApi', // Ten field trong state cua redux
  tagTypes: ['Posts'],
  // Những thằng tag này nó sẽ quản lí việc ép thằng nào fetch api lại hay không
  keepUnusedDataFor: 10,
  // Config thời gian unsubcription
  // Điều nãy nghĩa là mình sẽ setting global giúp cho nó bao nhiêu s thì xóa cache
  //giúp cho nó có thể get item mới
  //nó cũng có thể setting cho từng thằng ở dưới
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/',
    // custom để khi fetch thì truyền lên thêm một vài thứ
    prepareHeaders(headers) {
      headers.set('authorization', 'Bearer ABCXYZ')
      return headers
    }
  }), // url ma chung ta dung de fetch api
  //
  // endPoints là tập hợp của những method giúp get, post, put, delete, ... tương tác với server
  // khi khai báo endPoints nó sẽ sinh ra cho chúng ta các hook tương tự để dùng trong component
  // endPoints thường có hai kiểu là query và mutation
  endpoints: (build) => ({
    // Generic type theo thứ tự là kiểu response trả về và argument(cái mà truyền vào)
    getPosts: build.query<Post[], void>({
      // Nghĩa là khi mình dùng cái getPosts thì nó sẽ lấy baseQuery + thằng này
      query: () => 'posts',
      /**
       * providesTags có thể là array hoặc callback return array
       * Nếu có bất kỳ một invalidatesTag nào match với providesTags này
       * thì sẽ làm cho getPosts method chạy lại
       * và cập nhật lại danh sách các bài post cũng như các tags phía dưới
       */
      // result chính là kết quả khi mà get posts thành công
      /**
       * Cái callback này sẽ chạy mỗi khi getPosts chạy
       * Mong muốn là sẽ return về một mảng kiểu
       * ```ts
       * interface Tags: {
       *    type: "Posts";
       *    id: string;
       *  }[]
       *```
       * vì thế phải thêm as const vào để báo hiệu type là Read only, không thể mutate
       */
      // result là kết quả fetch api ở trên
      providesTags: (result) => {
        if (result) {
          const final = [
            ...result.map(({ id }) => ({ type: 'Posts' as const, id: id })),
            { type: 'Posts' as const, id: 'LIST' }
          ]
          return final
        }
        const final = [{ type: 'Posts' as const, id: 'LIST' }]
        return final
      }
    }),
    // Chúng ta dùng mutation đối với các trường hợp PUT, POST, DELETE
    addPost: build.mutation<Post, Omit<Post, 'id'>>({
      query(body) {
        try {
          // throw Error('Ehehehe')
          // let a: any = null
          // a.b = 1
          return {
            url: 'posts',
            method: 'POST',
            body
          }
        } catch (error: any) {
          throw new CustomError(error.message)
        }
      },
      /**
       * invalidatesTags cung cấp các tag để báo hiệu cho những method nào có providesTags
       * match với nó sẽ bị gọi lại
       * Trong trường hợp này getPosts sẽ chạy lại
       */
      invalidatesTags: (result, error, body) => (error ? [] : [{ type: 'Posts', id: 'LIST' }])
    }),
    getPost: build.query<Post, string>({
      query(id) {
        return {
          url: `posts/${id}`,
          headers: {
            hello: 'I am Nhan'
          },
          // Cách để mong muốn url có thêm đường dẫn như kiểu param ?first_name=nguyen&last_name=nhan
          params: {
            first_name: 'nguyen',
            'last-name': 'nhan'
          }
        }
      }
    }),
    updatePost: build.mutation<Post, { id: string; body: Post }>({
      query(data) {
        // throw Error('ahihihi')
        return {
          url: `posts/${data.id}`,
          method: 'PUT',
          body: data.body
        }
      },
      // get lại danh sách để cập nhật đồng bộ
      invalidatesTags: (result, error, data) => (error ? [] : [{ type: 'Posts', id: data.id }])
      //id nên để id của thằng cập nhật để có gì back ngược lại
    }),
    deletePost: build.mutation<{}, string>({
      query: (id) => ({
        url: `posts/${id}`,
        method: 'DELETE',
        body: id
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id: id }]
    })
  })
})

// export
export const { useGetPostsQuery, useAddPostMutation, useGetPostQuery, useUpdatePostMutation, useDeletePostMutation } =
  blogApi
