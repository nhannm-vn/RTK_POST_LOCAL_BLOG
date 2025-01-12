import { useSelector } from 'react-redux'
import CreatePost from './components/CreatePost'
import PostList from './components/PostList'
import { RootState } from 'store'
import { Fragment } from 'react/jsx-runtime'
import SkeletonForm from './components/SkeletonForm'

export default function Blog() {
  const loading = useSelector((state: RootState) => state.blog.loading)
  return (
    <div className='p-5'>
      {loading && (
        <Fragment>
          <SkeletonForm />
          <SkeletonForm />
          <SkeletonForm />
        </Fragment>
      )}
      {!loading && <CreatePost />}
      <PostList />
    </div>
  )
}
