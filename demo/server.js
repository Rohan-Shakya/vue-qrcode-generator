import http from "http";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import VueQRCode from "../dist/vue-qr-code.vue.esm.js";

const PORT = process.env.PORT ?? 3000;

const app = createSSRApp({
  data: () => ({
    value: "https://github.com/Rohan-Shakya/vue-qr-code",
    size: 300,
  }),
  components: { "vue-qr-code": VueQRCode },
  template: '<vue-qr-code :value="value" :size="size" render-as="svg" />',
});

http
  .createServer(async (request, response) => {
    const _html = await renderToString(app);

    const html = `
    <!DOCTYPE html>
    <html lang='en'>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Rohan-Shakya" />
        <meta name="Keywords" content="vue-qr-code, qrcode, vue-qr, vue" />
        <title>Vue QR Code SSR</title>
        <meta name="description" content="A Vue component for QR code." />
        <link rel="icon" type="images/png" href="logo.png" />
        <link rel="canonical" href="http://localhost:8080" />
        <meta property="og:site_name" content="vue-qr-code" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Vue QR Code" />
        <meta property="og:description" content="A Vue component for QR code." />
        <meta property="og:url" content="http://localhost:8080" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Vue QR Code" />
        <meta name="twitter:description" content="A Vue component for QR code." />
        <meta name="twitter:url" content="http://localhost:8080" />
      </head>
      <body>
        <div>${_html}</div>
      </body>
    </html>
    `;

    response.writeHead(200, {
      "Content-Type": "text/html",
    });

    response.end(html);
  })
  .listen(PORT);

console.log(`The server running at http://localhost:${PORT}`);
