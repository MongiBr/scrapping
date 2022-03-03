const axios = require("axios");
const { concatCSVAndOutput } = require("../middlewares/concatFilesCSV");

const { writeToCSVFile, json2array } = require("../middlewares/writeToCSVFile");

const getNintendoProducts = async (req, res) => {
  var data = [];

  let response = await axios.post(
    "https://u3b6gr4ua3-2.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (3.33.0); Browser (lite); JS Helper 2.20.1&x-algolia-application-id=U3B6GR4UA3&x-algolia-api-key=c4da8be7fd29f0f5bfa42920b0a99dc7",
    {
      requests: [
        {
          indexName: "ncom_game_en_us",
          params:
            "query=&hitsPerPage=2&maxValuesPerFacet=30&page=0&analytics=false&facets=%5B%22generalFilters%22%2C%22platform%22%2C%22availability%22%2C%22genres%22%2C%22howToShop%22%2C%22virtualConsole%22%2C%22franchises%22%2C%22priceRange%22%2C%22esrbRating%22%2C%22playerFilters%22%5D&tagFilters=",
        },
      ],
    }
  );

  if (response) {
    let nintendo = json2array(response.data);
    let nbTotal = nintendo[0][0].nbPages;
    let j = 1;
    let page = 0;

    for (let i = 0; i < nbTotal; i++) {
      console.log("start block...");
      console.log("page :", page);
      let resp = await axios.post(
        "https://u3b6gr4ua3-2.algolianet.com/1/indexes/*/queries?x-algolia-agent=Algolia for JavaScript (3.33.0); Browser (lite); JS Helper 2.20.1&x-algolia-application-id=U3B6GR4UA3&x-algolia-api-key=c4da8be7fd29f0f5bfa42920b0a99dc7",
        {
          requests: [
            {
              indexName: "ncom_game_en_us",
              params: `query=&hitsPerPage=2&maxValuesPerFacet=30&page=${page}&analytics=false&facets=%5B%22generalFilters%22%2C%22platform%22%2C%22availability%22%2C%22genres%22%2C%22howToShop%22%2C%22virtualConsole%22%2C%22franchises%22%2C%22priceRange%22%2C%22esrbRating%22%2C%22playerFilters%22%5D&tagFilters=`,
            },
          ],
        }
      );

      if (resp) {
        console.log("response! ...");
        console.log(resp.data);
        data = resp.data;
        await writeToCSVFile(data, `nintendo${j}`);
      }
      j = j + 1;
      page = page + 1;
      console.log("next block...");
    }
    if (j > 1) {
      let csvFiles = [];
      for (let i = 1; i < j; i++) {
        csvFiles.push(`public/static/nintendo${i}.csv`);
      }
      console.log(csvFiles);
      await concatCSVAndOutput(csvFiles, "public/static/nintendoCSV.csv", "nintendo", res).then(() => {});
    } else {
      return res.send("Error API closed! RETRY");
    }

    /*  console.log(response.data);
        data = response.data;
        const result = await writeToCSVFile(data, "nintendo");

        return res.download(result); */
  } /*  else {
        return res.send(res.json(data));
      } */
};

module.exports = {
  getNintendoProducts,
};
