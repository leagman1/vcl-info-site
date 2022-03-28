const express = require('express');
const path = require("path");
const app = express();
const port = 8080;

const fs = require("fs");

app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));

var mapFile = fs.readFileSync("data/maps.json");
var mapPool = JSON.parse(mapFile);
console.log(mapPool);

var seasons = [
    {
        id: 1
    },
    {
        id: 2
    },
    {
        id: 3
    }
];

app.get('/', (req, res) => {
  res.render('maps', {seasons: seasons, mapPool: mapPool});
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})