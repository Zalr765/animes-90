const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send("I'm alive");
});

function run() {
  app.listen(80, '0.0.0.0', () => {
    console.log('Server is running');
  });
}

function keep_alive() {
  run();
}

module.exports = keep_alive;