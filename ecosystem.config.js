module.exports = {
  apps : [
      {
        name: "scrapping",
        script: "./src/app.js",
        watch: true,
        env: {
          "PORT": "5000",
        }
      }
  ]
}
