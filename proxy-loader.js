require("dotenv").config();
const fs = require("fs");

const proxyConfig = {
  "/api": {
    target: "https://moswkj.myshopify.com",
    secure: true,
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/admin/api/2024-01",
    },
    headers: {
      "X-Shopify-Access-Token": process.env.SHOPIFY_ACCESS_TOKEN || "",
    },
  },
};

fs.writeFileSync("proxy.conf.json", JSON.stringify(proxyConfig, null, 2));
console.log("✅ Proxy configuration updated successfully.");
