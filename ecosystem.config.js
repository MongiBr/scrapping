module.exports = {
  apps : [
      {
        name: "scrapping",
        script: "./src/app.js",
        watch: false,
        env: {
          "PORT": "5000",
        }
      }
  ]
}
