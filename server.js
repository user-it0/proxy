const express = require('express');
const unblocker = require('unblocker');
const path = require('path');

const app = express();

app.use(unblocker({ prefix: '/proxy/' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`T.M.proxy running on port ${PORT}`);
});