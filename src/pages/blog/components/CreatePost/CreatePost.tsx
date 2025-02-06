import classNames from 'classnames'
import { useAddPostMutation, useGetPostQuery, useUpdatePostMutation } from 'pages/blog/blog.service'
import { cancelEditPost } from 'pages/blog/blog.slice'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'store'
import Post from 'types/blog.type'
import { isEntityError } from 'utils/helpers'

// initialState
const initialState: Omit<Post, 'id'> = {
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false,
  title: ''
}

// Đây là type lỗi 422 EntityError dùng để hiển thị lỗi ngay trên form khi post hoặc put
/**
 * Mẹo copy các key của kiểu Omit<Post, 'id'> để làm key cho kiểu FormError
 */
// Lưu ý khi xài mẹo này thì phải xài type chứ không được dùng interface
type FormError =
  | {
      [key in keyof Omit<Post, 'id'>]: string
    }
  | null

export default function CreatePost() {
  const dispatch = useDispatch()
  // state để quản lí form
  const [formData, setFormData] = useState<Omit<Post, 'id'> | Post>(initialState)

  // lấy postId để get post và hiển thị trên form
  //mà giá trị đó chính là được lưu trong state của redux
  const postId = useSelector((state: RootState) => state.blog.postId)

  // get post
  //refetch để giúp hồi khi update thì sẽ get lại để cho nó kịp đồng bộ để lấy thì sẽ có
  //khi mình lấy method refetch này nó sẽ giúp mình fetch lại thêm lần nữa
  const { data, refetch } = useGetPostQuery(postId, {
    // Vì mình mong muốn nó chỉ gọi getPost khi có id thôi
    //còn không có id thì đừng gọi để nhằm lẫn getPosts
    skip: !postId,
    // **refetchOnMountOrArgChange thằng này giúp cho fetch lại dữ liệu mỗi khi
    //hook này chạy // nếu truyền boolean thì mỗi lần chạy thì nó fetch lại luôn, còn nếu mà mình truyền number
    //thì nó sẽ cho thời gian delay là 5s
    refetchOnMountOrArgChange: true,
    // Thằng này khi hook chạy thì tùy theo thời gian mà nó sẽ gọi lại
    //áp dụng cho real time những trang mà cần thời gian thực hiệu quả
    pollingInterval: 1000
  })

  // Khi vào lần đầu hoặc data có thay đổi thì set lại form
  useEffect(() => {
    if (data) {
      // Lúc update thì form data của chúng ta chứa thằng Post có id sẵn
      //còn lúc add thì chỉ lấy 4 giá trị còn id thì json.server tự cho
      setFormData(data)
    }
  }, [data])

  // addPost
  const [addPost, addPostResult] = useAddPostMutation()

  // updatePost
  const [updatePost, updatePostResult] = useUpdatePostMutation()

  // addPost
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Ngăn load lại
    event.preventDefault()
    if (postId) {
      // có postId nghĩa là đang muốn update
      await updatePost({
        id: postId,
        body: formData as Post
      }).unwrap()
      // reset
      handleCancelEdit()
      // get lại cái cho nó xóa cache
      // refetch()
    } else {
      await addPost(formData).unwrap()
      // clear form data
      setFormData(initialState)
    }
  }
  // console.log(
  //   `Nam moi code dau thang do
  //   Cot dien nen la cot chien nhe
  //   Co gang no luc nhieu hon nua nhe
  //   Dam me la khong tu bo`
  // )

  // cancelEditPost
  // method cancel edit post
  const handleCancelEdit = () => {
    dispatch(cancelEditPost())
    setFormData(initialState)
  }

  // -------------------------------------------
  // Xử lí lỗi
  /**
   * Lỗi có thể đến từ `addPostResult` hoặc `updatePostResult`
   * Vậy chúng ta sẽ dựa vào điều kiện có postId hoặc không có (tức đang trong chế độ edit hay không) để show lỗi
   *
   * Chúng ta cũng không cần thiết phải tạo một state errorForm
   * Vì errorForm phụ thuộc vào `addPostResult`, `updatePostResult` và `postId` nên có thể dùng một biến để tính toán
   */
  const errorForm: FormError = useMemo(() => {
    // Dựa vào postId để check trạng thái đang làm gì
    const errorResult = postId ? updatePostResult.error : addPostResult.error
    // Vì errorResult có thể là FetchBaseQueryError | SerializedError | undefined, mỗi kiểu lại có cấu trúc khác nhau
    // nên chúng ta cần kiểm tra để hiển thị cho đúng
    // ***Lưu ý ở đây thì chúng ta chỉ check các lỗi là EntityError liên quan đến post put để mà hiển thị lên form
    if (isEntityError(errorResult)) {
      // Vào tới đây chắc chắn là lỗi EntityError 422
      // Có thể ép kiểu một cách an toàn chỗ này, vì chúng ta đã kiểm tra chắc chắn rồi
      // Nếu không muốn ép kiểu thì có thể khai báo cái interface `EntityError` sao cho data.error tương đồng với FormError là được
      console.log(errorResult)
      return errorResult.data.error as FormError
    }
    // Còn nếu không phải EntityError thì return null
    //vì mình chỉ muốn xủa lí các cái lỗi liên quan đến post put thôi còn các lỗi khác thì mình sẽ cho toast lên
    return null
  }, [postId, addPostResult, updatePostResult])

  return (
    <form onSubmit={handleSubmit}>
      <button
        className='group relative inline-flex items-center justify-center overflow-hidden 
        rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium
         text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300
          group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
        type='button'
        onClick={() => {
          refetch()
        }}
      >
        <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
          Force Fetch
        </span>
      </button>
      <div className='mb-6'>
        <label htmlFor='title' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Title
        </label>
        <input
          type='text'
          id='title'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Title'
          required
          value={formData.title}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, title: event.target.value }))
          }}
        />
      </div>
      <div className='mb-6'>
        <label htmlFor='featuredImage' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'>
          Featured Image
        </label>
        <input
          type='text'
          id='featuredImage'
          className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
          placeholder='Url image'
          required
          value={formData.featuredImage}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, featuredImage: event.target.value }))
          }}
        />
      </div>
      <div className='mb-6'>
        <div>
          <label htmlFor='description' className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-400'>
            Description
          </label>
          <textarea
            id='description'
            rows={3}
            className='block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500'
            placeholder='Your description...'
            required
            value={formData.description}
            onChange={(event) => {
              setFormData((prev) => ({ ...prev, description: event.target.value }))
            }}
          />
        </div>
      </div>
      <div className='mb-6'>
        <label
          htmlFor='publishDate'
          // classnames dùng để nối lại cho tiện hơn thôi chứ kcg
          className={classNames('mb-2 block text-sm font-medium ', {
            'text-red-700': Boolean(errorForm?.publishDate),
            'dark:text-gray-400': !Boolean(errorForm?.publishDate)
          })}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className={classNames('block w-56 rounded-lg border  p-2.5 text-sm  focus:outline-none ', {
            //
            'border-red-500 bg-red-50 text-red-900 placeholder-red-700 focus:border-red-500 focus:ring-blue-500':
              Boolean(errorForm?.publishDate),
            //
            'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500 focus:ring-blue-500': !Boolean(
              errorForm?.publishDate
            )
          })}
          placeholder='Publish Date'
          required
          value={formData.publishDate}
          onChange={(event) => setFormData((prev) => ({ ...prev, publishDate: event.target.value }))}
        />
        {/* show message */}
        {errorForm?.publishDate && (
          <p className='mt-2 text-sm text-red-600'>
            <span className='font-medium'>Lỗi!</span>
            {errorForm.publishDate}
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox'
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          checked={formData.published}
          onChange={(event) =>
            setFormData((prev) => ({
              ...prev,
              published: event.target.checked
            }))
          }
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {Boolean(!postId) && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}
        {Boolean(postId) && (
          <Fragment>
            <button
              type='submit'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-teal-300 to-lime-300 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-lime-200 group-hover:from-teal-300 group-hover:to-lime-300 dark:text-white dark:hover:text-gray-900 dark:focus:ring-lime-800'
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Update Post
              </span>
            </button>
            <button
              type='reset'
              className='group relative mb-2 mr-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400'
              onClick={() => {
                handleCancelEdit()
              }}
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>
          </Fragment>
        )}
      </div>
    </form>
  )
}
