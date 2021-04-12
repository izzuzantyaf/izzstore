const app = require('./src/app')
const db = require('./src/config/database')
const port = process.env.PORT || 8000

db.setup()

app.listen(port, () => {
  console.log('Server started in port ' + port)
})
