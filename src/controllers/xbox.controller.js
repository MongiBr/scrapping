const axios = require("axios");
const { concatCSVAndOutput } = require("../middlewares/concatFilesCSV");
const { writeToCSVFile, json2array, removeDuplicate } = require("../middlewares/writeToCSVFile");

const getXboxProducts = async (req, res) => {
  var data = [];
  let ids = "";
  let ids2 = [];
  const resIds = await axios.get("https://catalog.gamepass.com/sigls/v2?id=f6f1f99f-9b49-4ccd-b3bf-4d9767a77f5e&language=fr-fr&market=FR");

  let xbox = json2array(resIds.data);
  let allIds = xbox;
  for (let i = 1; i < allIds.length; i++) {
    ids = ids + allIds[i].id + ",";
    ids2.push(allIds[i].id);
  }

  const resIds2 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=b8900d09-a491-44cc-916e-32b5acae621b&language=fr-fr&market=FR");

  let xbox2 = json2array(resIds2.data);
  let allIds2 = xbox2;
  for (let i = 1; i < allIds2.length; i++) {
    ids = ids + allIds2[i].id + ",";
    ids2.push(allIds2[i].id);
  }

  const resIds3 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=a884932a-f02b-40c8-a903-a008c23b1df1&language=fr-fr&market=FR");

  let xbox3 = json2array(resIds3.data);
  let allIds3 = xbox3;
  for (let i = 1; i < allIds3.length; i++) {
    ids = ids + allIds3[i].id + ",";
    ids2.push(allIds3[i].id);
  }

  const resIds4 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=79fe89cf-f6a3-48d4-af6c-de4482cf4a51&language=fr-fr&market=FR");

  let xbox4 = json2array(resIds4.data);
  let allIds4 = xbox4;
  for (let i = 1; i < allIds4.length; i++) {
    ids = ids + allIds4[i].id + ",";
    ids2.push(allIds4[i].id);
  }
  /*    const resIds5 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=b8900d09-a491-44cc-916e-32b5acae621b&language=fr-fr&market=FR");

  let xbox5 = json2array(resIds5.data);
  let allIds5 = xbox5;
  for (let i = 1; i < allIds5.length; i++) {
    ids = ids + allIds5[i].id + ",";
    ids2.push(allIds5[i].id);
  }  */

  const resIds6 = await axios.get("	https://catalog.gamepass.com/sigls/v2?id=1d33fbb9-b895-4732-a8ca-a55c8b99fa2c&language=fr-fr&market=FR");

  let xbox6 = json2array(resIds6.data);
  let allIds6 = xbox6;
  for (let i = 1; i < allIds6.length; i++) {
    ids = ids + allIds6[i].id + ",";
    ids2.push(allIds6[i].id);
  }

  const resIds7 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=609d944c-d395-4c0a-9ea4-e9f39b52c1ad&language=fr-fr&market=FR");

  let xbox7 = json2array(resIds7.data);
  let allIds7 = xbox7;
  for (let i = 1; i < allIds7.length; i++) {
    ids = ids + allIds7[i].id + ",";
    ids2.push(allIds7[i].id);
  }

  const resIds8 = await axios.get("https://catalog.gamepass.com/sigls/v2?id=29a81209-df6f-41fd-a528-2ae6b91f719c&language=fr&market=fr");

  let xbox8 = json2array(resIds8.data);
  let allIds8 = xbox8;
  for (let i = 1; i < allIds8.length; i++) {
    ids = ids + allIds8[i].id + ",";
    ids2.push(allIds8[i].id);
  }

  /* concatCSVAndOutput(["public/static/xbox.csv", "public/static/ps.csv"], "outputfile.csv").then(() => console.log("ok")); */

  var j = 1;
  var start = 0;
  var fin = 50;
  while (fin < ids2.length) {
    var arry = ids2.slice(start, fin);
    console.log("array : ", arry.toString());
    start = fin;
    fin = fin + 50;
    const response = await axios.get(
      `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${arry.toString()}&market=FR&languages=fr-fr&MS-CV=DGU1mcuYo0WMMp+F.1`
    );
    if (response) {
      console.log(response.data);
      data = response.data;
      await writeToCSVFile(data, `xbox${j}`);
      j = j + 1;
    }
  }
  if (j > 1) {
    let csvFiles = [];
    for (let i = 1; i < j; i++) {
      csvFiles.push(`public/static/xbox${i}.csv`);
    }
    console.log(csvFiles);
    await concatCSVAndOutput(csvFiles, "public/static/xboxCSV.csv", "xbox", res).then(() => {
      let array = removeDuplicate("public/static/xboxCSV.csv", res);
      console.log(array);
    });
  } else {
    return res.send("Error");
  }
};

module.exports = {
  getXboxProducts,
};
