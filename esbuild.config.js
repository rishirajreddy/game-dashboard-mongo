// esbuild.config.js
const path = require("path");
const fs = require("fs-extra"); // Require the fs-extra package

fs.copySync(
  path.resolve(__dirname, "package.json"),
  path.resolve(__dirname, "dist", "package.json")
);

require("esbuild")
  .build({
    entryPoints: [path.resolve(__dirname, "src", "index.ts")],
    bundle: true,
    minify: true,
    target: "node16",
    platform: "node",
    outfile: path.resolve(__dirname, "dist", "index.js"), // Specify the output file
    external: [
      "axios",
      "express",
      "mongoose",
      "socket.io",
      "jsonwebtoken",
      "pm2",
      "@mapbox/node-pre-gyp",
      "mock-aws-s3",
      "aws-sdk",
      "nock",
      "bcrypt",
    ],
  })
  .catch(() => process.exit(1));
