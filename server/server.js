const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query)
})

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)

// Thêm vào một middleware
server.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    // Kiểm tra nếu thời gian của bài post < thời gian thực thì báo lỗi
    if (new Date(req.body.publishDate).getTime() < new Date().getTime()) {
      return res.status(422).send({
        error: {
          publishDate: 'Không được public vào thời điểm trong quá khứ'
        }
      })
    }
    // Tạo lỗi để test code xử lí lỗi
    // Nếu người dùng gửi lên trong body mà có title = admin thì tạo cái lỗi
    // *test lỗi trả về mà chỉ có message
    if (req.body.title === 'admin') {
      return res.status(500).send({
        error: 'Server bi loi'
      })
    }
  }
  setTimeout(() => {
    // Tiếp tục trả về cho client
    next()
  }, 2000)
})

// Use default router
server.use(router)
server.listen(4000, () => {
  console.log('JSON Server is running')
})
