const express = require('express')
const app = express()
const port = 8080;

app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('base_banner')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})