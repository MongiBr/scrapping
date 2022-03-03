const axios = require("axios");
const { concatCSVAndOutput } = require("../middlewares/concatFilesCSV");
const { writeToCSVFile, json2array } = require("../middlewares/writeToCSVFile");

const getPsroducts = async (req, res) => {
  var data = [];
  const r = await axios.get(
    "https://web.np.playstation.com/api/graphql/v1//op?operationName=categoryGridRetrieve&variables=%7B%22id%22%3A%22d71e8e6d-0940-4e03-bd02-404fc7d31a31%22%2C%22pageArgs%22%3A%7B%22size%22%3A2%2C%22offset%22%3A0%7D%2C%22sortBy%22%3A%7B%22name%22%3A%22productReleaseDate%22%2C%22isAscending%22%3Afalse%7D%2C%22filterBy%22%3A[]%2C%22facetOptions%22%3A[]%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%224ce7d410a4db2c8b635a48c1dcec375906ff63b19dadd87e073f8fd0c0481d35%22%7D%7D&fbclid=IwAR3WxXF51T_o0rc1Wpg6L7KTSIhINBIYM8nf2_nenIv_Bp61YP43UGYHG9E"
  );
  let ps = json2array(r.data);
  let size = ps[0].categoryGridRetrieve.pageInfo.totalCount;

  let j = 1;
  let all = 10;
  let offset = 0;
  let i = 0;
  while (i < size) {
    console.log("start new block ...");
    const response = await axios.get(
      `https://web.np.playstation.com/api/graphql/v1//op?operationName=categoryGridRetrieve&variables=%7B%22id%22%3A%22d71e8e6d-0940-4e03-bd02-404fc7d31a31%22%2C%22pageArgs%22%3A%7B%22size%22%3A${all}%2C%22offset%22%3A${offset}%7D%2C%22sortBy%22%3A%7B%22name%22%3A%22productReleaseDate%22%2C%22isAscending%22%3Afalse%7D%2C%22filterBy%22%3A[]%2C%22facetOptions%22%3A[]%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%224ce7d410a4db2c8b635a48c1dcec375906ff63b19dadd87e073f8fd0c0481d35%22%7D%7D&fbclid=IwAR3WxXF51T_o0rc1Wpg6L7KTSIhINBIYM8nf2_nenIv_Bp61YP43UGYHG9E`
    );
    if (response) {
      data = response.data;
      console.log("waiting ...");
      await writeToCSVFile(data, `ps${j}`);

      j = j + 1;
      offset = offset + 10;
      i = i + 10;
      console.log("end block ...");
    }
  }
  if (j > 1) {
    let csvFiles = [];
    for (let i = 1; i < j; i++) {
      csvFiles.push(`public/static/ps${i}.csv`);
    }
    console.log(csvFiles);
    await concatCSVAndOutput(csvFiles, "public/static/psCSV.csv", "ps", res).then(() => {});
  } else {
    return res.send("Error");
  }
};
module.exports = {
  getPsroducts,
};
