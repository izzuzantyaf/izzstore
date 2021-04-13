const app = require('./server/app')
const db = require('./server/config/database')

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log('Server started in port ' + port)
  db.setup()
})
