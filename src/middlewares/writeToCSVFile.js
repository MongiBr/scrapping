const createCsvWriter = require("csv-writer").createObjectCsvWriter;
var fs = require("fs");
const json2csv = require("json2csv").parse;
const csv = require("csvtojson");
var newLine = "\r\n";

const removeDuplicate = async function (pathFile, response) {
  const jsonArray = await csv().fromFile(pathFile);
  let ary = json2array(jsonArray);
  let aryWithoutDup;

  if (ary.length) {
  }
  let res = await writeToCSVFile(aryWithoutDup, "AnnouncesLeBonCoin");
  return response.download("public/static/AnnouncesLeBonCoin.csv");
};

const addPhoneToCsv = async function (pathFile, data, response) {
  const jsonArray = await csv().fromFile(pathFile);
  let ary = json2array(jsonArray);
  for (let i = 0; i < ary.length; i++) {
    if (!ary[i].phone && ary[i].linkAnnonce.includes(data.link)) {
      let newLine = {
        title: ary[i].title,
        typeBiens: ary[i].typeBiens,
        linkAnnonce: ary[i].linkAnnonce,
        city: ary[i].city,
        postalCode: ary[i].postalCode,
        phone: data.phone == "" ? "Pas de numéro" : data.phone,
        price: ary[i].price,
      };
      console.log("params", newLine);
      await writeToCSVFilePhone(newLine, "AnnouncesLeBonCoin");
    }
  }
};

const getFromCsv = async function (pathFile, response) {
  // const jsonArray = await csv().fromFile(pathFile);
  // let ary = json2array(jsonArray);

  // response.json(ary[0].linkAnnonce);
};

async function writeToCSVFilePhone(announces, file) {
  try {
    const csvWriter = createCsvWriter({
      path: "public/static/Announces.csv",
      header: [
        { id: "title", title: "title" },
        { id: "typeBiens", title: "typeBiens" },
        { id: "linkAnnonce", title: "linkAnnonce" },
        { id: "city", title: "city" },
        { id: "postalCode", title: "postalCode" },
        { id: "phone", title: "phone" },
        { id: "price", title: "price" },
      ],
    });
    let fields = ["title", "typeBiens", "linkAnnonce", "city", "postalCode", "phone", "price"];

    fs.stat(`public/static/${file}.csv`, function (err, stat) {
      if (err == null) {
        console.log("File exists");

        var csv =
          announces.title +
          "," +
          announces.typeBiens +
          "," +
          announces.linkAnnonce +
          "," +
          announces.city +
          "," +
          announces.postalCode +
          "," +
          announces.phone +
          "," +
          announces.price +
          newLine;

        fs.appendFile(`public/static/${file}.csv`, csv, function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      } else {
        //write the headers and newline
        console.log("New file, just writing headers");
        fields = fields + newLine;

        fs.writeFile(`public/static/${file}.csv`, fields, function (err) {
          if (err) throw err;
          console.log("file saved");
        });
      }
    });

    const jsonArray = await csv().fromFile("public/static/Announces.csv");
    let ary = json2array(jsonArray);
    let newFile = [];
    for (let i = 1; i < ary.length; i++) {
      newFile.push(ary[i]);
    }
    fs.unlinkSync("public/static/Announces.csv");
    await csvWriter.writeRecords(newFile).then(() => console.log("The CSV file was written successfully"));
    let res = `public/static/${file}.csv`;
    return res;
  } catch (err) {
    console.log(err);
  }
}

async function writeToCSVFile(announces, file) {
  try {
    let fields = ["title", "typeBiens", "linkAnnonce", "city", "postalCode", "phone", "price"];

    fs.stat(`public/static/${file}.csv`, function (err, stat) {
      if (err == null) {
        console.log("File exists");

        var csv =
          announces.title +
          "," +
          announces.typeBiens +
          "," +
          announces.linkAnnonce +
          "," +
          announces.city +
          "," +
          announces.postalCode +
          "," +
          announces.phone +
          "," +
          announces.price +
          newLine;

        fs.appendFile(`public/static/${file}.csv`, csv, function (err) {
          if (err) throw err;
          console.log('The "data to append" was appended to file!');
        });
      } else {
        //write the headers and newline
        console.log("New file, just writing headers");
        fields = fields + newLine;

        fs.writeFile(`public/static/${file}.csv`, fields, function (err) {
          if (err) throw err;
          console.log("file saved");
        });
      }
    });
    /* const csvWriter = createCsvWriter({
      path: `public/static/${file}.csv`,
      header: [
        { id: "title", title: "title" },
        { id: "linkAnnonce", title: "linkAnnonce" },
        { id: "typeBiens", title: "typeBiens" },
        { id: "city", title: "city" },
        { id: "postalCode", title: "postalCode" },
        { id: "phone", title: "phone" },
      ],
    }); */
    /*   let result = extractAsCSV(announces);
    await csvWriter.writeRecords(result).then(() => console.log("The CSV file was written successfully")); */
    let res = `public/static/${file}.csv`;
    return res;
  } catch (err) {
    console.log(err);
  }
}

function extractAsCSV(announces, pathFile) {
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
        price: data[i].price,
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
  addPhoneToCsv,
  getFromCsv,
};
