const express = require('express');
const unblocker = require('unblocker');
const path = require('path');

const app = express();

// プロキシ機能（/proxy/ で始まるURLを中継）
app.use(unblocker({
  prefix: '/proxy/',
  decodeURLs: false, // encodeURIComponent せずURLをそのまま使う
  requestMiddleware: [
    (req, res, next) => {
      req.headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)';
      req.headers['referer'] = 'https://www.google.com/';
      next();
    }
  ]
}));

// 静的ファイル（index.html, style.css, script.jsなど）を配信
app.use(express.static(path.join(__dirname, 'public')));

// ホームにアクセスが来たら index.html を返す
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// エラーハンドラー（開発中のトラブル対応）
app.use((err, req, res, next) => {
  console.error('サーバーエラー:', err.stack || err);
  res.status(500).send('Internal Server Error');
});

// ポート指定（Railwayの環境変数対応）
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ T.M.proxy running on port ${PORT}`);
});
