const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const csv = require("csvtojson");

const removeDuplicate = async function (pathFile, response) {
  const jsonArray = await csv().fromFile(pathFile);
  let ary = json2array(jsonArray);
  let aryWithoutDup;
  if (ary.length) {
    aryWithoutDup = [...new Set(ary)];
  }
  let res = await writeToCSVFile(aryWithoutDup, "AnnouncesLeBonCoin");
  return response.download("public/static/AnnouncesLeBonCoin.csv");
};

async function writeToCSVFile(announces, file) {
  try {
    const csvWriter = createCsvWriter({
      path: `public/static/${file}.csv`,
      header: [
        { id: "title", title: "title" },
        { id: "linkAnnonce", title: "linkAnnonce" },
        { id: "typeBiens", title: "typeBiens" },
        { id: "city", title: "city" },
        { id: "postalCode", title: "postalCode" },
        { id: "phone", title: "phone" },
      ],
    });
    let result = extractAsCSV(announces);
    await csvWriter.writeRecords(result).then(() => console.log("The CSV file was written successfully"));
    let res = `public/static/${file}.csv`;
    return res;
  } catch (err) {
    console.log(err);
  }
}

function extractAsCSV(announces) {
  const data = json2array(announces);

  let result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i]) {
      result.push({
        title: data[i].title,
        linkAnnonce: data[i].linkAnnonce,
        typeBiens: data[i].typeBiens,
        city: data[i].city,
        postalCode: data[i].postalCode,
        phone: data[i].phone,
      });
    }
  }

  return result;
}

function json2array(json) {
  var result = [];

  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

module.exports = {
  writeToCSVFile,
  json2array,
  removeDuplicate,
};
