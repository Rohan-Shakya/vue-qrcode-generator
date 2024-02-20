import http from "http";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import VueQRCodeGenerator from "../dist/vue-qrcode-generator.vue.esm.js";

const PORT = process.env.PORT ?? 3000;

const app = createSSRApp({
  data: () => ({
    value: "https://github.com/Rohan-Shakya/vue-qrcode-generator",
    size: 300,
  }),
  components: { "vue-qrcode-generator": VueQRCodeGenerator },
  template:
    '<vue-qrcode-generator :value="value" :size="size" render-as="svg" />',
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
        <meta name="Keywords" content="vue-qrcode-generator, qrcode, vue-qr, vue" />
        <title>Vue QR Code SSR</title>
        <meta name="description" content="A Vue component for QR code." />
        <link rel="icon" type="images/png" href="https://raw.githubusercontent.com/Rohan-Shakya/vue-qrcode-generator/main/demo/logo.png" />
        <link rel="canonical" href="http://localhost:8080" />
        <meta property="og:site_name" content="vue-qrcode-generator" />
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
