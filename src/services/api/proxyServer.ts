import { createServer } from 'cors-anywhere';

const host = 'localhost';
const port = 8080;

createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, () => {
  console.log(`CORS Anywhere proxy running on ${host}:${port}`);
});