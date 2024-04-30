const app = require('./router/routes/app')
const { PORT = 9090 } = process.env
app.listen(PORT, () => console.log(`Listening on ${PORT}...`))