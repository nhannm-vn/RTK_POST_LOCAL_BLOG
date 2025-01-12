import { unwrapResult } from '@reduxjs/toolkit'
import { omit } from 'lodash'
import { addPost, cancelEditingPost, updatePost } from 'pages/blog/blog.slice'
import React, { Fragment, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState, useAppDispatch } from 'store'
import Post from 'types/blog.type'

const initialState: Post = {
  id: '',
  description: '',
  featuredImage: '',
  publishDate: '',
  published: false, // chưa public
  title: ''
}

// Kiểu dữ liệu cho errorForm
interface ErrorForm {
  publishDate: string
}

export default function CreatePost() {
  // Tạo cái state để lưu dữ liệu post từ form
  const [formData, setFormData] = useState<Post>(initialState)

  // State để khi có error thì sẽ lưu vào để hiển thị lên UI
  const [errorForm, setErrorForm] = useState<null | ErrorForm>(null)

  // Tạo dispatch chuyên dùng để cập nhật dữ liệu của redux

  const dispatch = useAppDispatch()

  // Lấy editingPost từ state redux
  const editingPost = useSelector((state: RootState) => state.blog.editingPost)

  // Nó sẽ chờ khi mà editingPost thay đổi thì nó sẽ chạy
  useEffect(() => {
    // Nếu không có edit gì thì để các ô hiển thị giá trị mặc định
    setFormData(editingPost || initialState)
  }, [editingPost])

  // Khi submmit thì chạy cái func này để lấy dữ liệu từ form
  //và sử dụng dispatch
  const handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void = (event) => {
    // Ngăn load lại
    event.preventDefault()
    if (editingPost) {
      dispatch(updatePost({ postId: editingPost.id, body: formData }))
        .unwrap()
        .then(() => {
          // Update hoặc Public xong thì phải làm sạch sẽ lại cái form
          // Nghĩa là thành công thì mới set lại cái form và có reset. Nghĩa là mới làm sách mấy cái ô nhập
          setFormData(initialState)
          if (errorForm) {
            // Khi mà thành công thì cũng phải reset lại errorForm
            setErrorForm(null)
          }
        })
        .catch((err) => {
          // Nếu update mà có lỗi thì setState lại
          setErrorForm(err.error)
        })
      // Bình thường khi dispatch asyncThunk thì sẽ đóng gói. Nên cần mở gói cái
    } else {
      // Thêm id cho cục data form trước khi cập nhật lên
      // const formDataWithId = { ...formData, id: new Date().toISOString() }
      // console.log(formDataWithId)
      dispatch(addPost(omit(formData, ['id'])))
        .unwrap()
        .then(() => {
          setFormData(initialState)
          if (errorForm) setErrorForm(null)
        })
        .catch((error) => {
          setErrorForm(error.error)
        })
    }
  }

  const handleCancelEditingPost = () => {
    dispatch(cancelEditingPost())
  }

  return (
    <form onSubmit={handleSubmit} onReset={handleCancelEditingPost}>
      <div className='mb-6'>
        <label
          htmlFor='title' //
          className='mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300'
        >
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
          className={`mb-2 block text-sm font-medium  dark:text-gray-300 
          ${errorForm?.publishDate ? 'text-red-700' : 'text-gray-900'}`}
        >
          Publish Date
        </label>
        <input
          type='datetime-local'
          id='publishDate'
          className={`block w-56 rounded-lg border text-sm p-2.5 focus:outline-none
            ${
              errorForm?.publishDate
                ? 'border-red-500 bg-red-50 text-red-900 placeholder-red-900 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 bg-gray-50 text-gray-900 focus:border-blue-500  focus:ring-blue-500 '
            }`}
          placeholder='Title'
          required
          value={formData.publishDate}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, publishDate: event.target.value }))
          }}
        />
        {/* Nếu có lỗi thì show text */}
        {errorForm?.publishDate && ( //
          <p className='mt-2 text-sm text-red-600'>
            <span className='font-medium'>Lỗi!</span>
            {errorForm.publishDate}
          </p>
        )}
      </div>
      <div className='mb-6 flex items-center'>
        <input
          id='publish'
          type='checkbox' //
          className='h-4 w-4 focus:ring-2 focus:ring-blue-500'
          checked={formData.published}
          onChange={(event) => {
            setFormData((prev) => ({ ...prev, published: event.target.checked }))
          }}
        />
        <label htmlFor='publish' className='ml-2 text-sm font-medium text-gray-900'>
          Publish
        </label>
      </div>
      <div>
        {editingPost && (
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
            >
              <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
                Cancel
              </span>
            </button>{' '}
          </Fragment>
        )}
        {!editingPost && (
          <button
            className='group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-blue-300 group-hover:from-purple-600 group-hover:to-blue-500 dark:text-white dark:focus:ring-blue-800'
            type='submit'
          >
            <span className='relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900'>
              Publish Post
            </span>
          </button>
        )}
      </div>
    </form>
  )
}
