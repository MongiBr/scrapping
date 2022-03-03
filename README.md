# Scrapping apis - nodeJS

Gang - G&G application:

- get all products from XBOX | NINTENDO | PS
- create CSV files

How to use:

- clone this project or download the zip
- open the folder and
  run npm install to install all packages
- run this app with npm start
- go to the browser
- xbox : http://localhost/api/scrapping/xbox and wait the file downloaded
- nintendo : http://localhost/api/scrapping/nintendo and wait the file downloaded
- ps : http://localhost/api/scrapping/ps and wait the file downloaded

Packages Used:

- [morgan](https://www.npmjs.com/package/morgan)
  - HTTP request logger middleware for node.js
- [helmet](https://www.npmjs.com/package/helmet)
  - Helmet helps you secure your Express apps by setting various HTTP headers. It's not a silver bullet, but it can help!
- [dotenv](https://www.npmjs.com/package/dotenv)
  - Dotenv is a zero-dependency module that loads environment variables from a `.env` file into `process.env`

Development packages:

- [nodemon](https://www.npmjs.com/package/nodemon)
  - nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

## Setup

```
npm install
```

## Development

```
npm run dev
```
