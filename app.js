const express = require('express');
const path = require("path");
const app = express();
const port = 8080;

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('maps')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})