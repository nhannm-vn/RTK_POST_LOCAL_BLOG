import Blog from 'pages/blog'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Fragment } from 'react/jsx-runtime'

function App() {
  return (
    <Fragment>
      <ToastContainer />
      <Blog />
    </Fragment>
  )
}

export default App
