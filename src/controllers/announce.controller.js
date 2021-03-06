const { writeToCSVFile, addPhoneToCsv, getFromCsv } = require("../middlewares/writeToCSVFile");
const fs = require("fs");
var _ = require("lodash");
const { default: axios } = require("axios");
var moment = require("moment");
const csv = require("csvtojson");
const json2csv = require("json2csv").parse;
function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}
const exportAnnonces = async (req, res) => {
  try {
    let data = req.body;
    if (data && data.announces && data.announces.length > 0) {
      const jsonArray = await csv().fromFile("public/static/get_urls.csv");
      let urls = json2array(jsonArray);

      const fileData = JSON.parse(fs.readFileSync("announces.json"));
      await data.announces.map((item) => {
        let str = item.linkRecherche.replace("https://www.leboncoin.fr/recherche", "");
        let lengthStr = str.length;
        let n = str.substring(str.indexOf("locations=") + 10, lengthStr);
        let lastStr = n.substring(0, n.indexOf("&"));

        let cityAndUser = urls.find((data) =>
          replaceAll((data.url.replace("https://www.leboncoin.fr/recherche/", ""), "|", ",")).includes(
            "=" + replaceAll(replaceAll(encodeURI(lastStr), "'", "%27"))
          )
        );
        if (!cityAndUser) {
          cityAndUser = urls.find((data) => data.url.includes(lastStr));
        }
        Object.assign(item, { city_id: cityAndUser.city_id, user_id: cityAndUser.user_id });
        fileData.push(item);
      });
      fs.writeFileSync("announces.json", JSON.stringify(_.uniqWith(fileData, _.isEqual), null, 2));
    }

    return res.send("Line added to csv");
  } catch (err) {
    console.log(err);
  }
};

const getUrls = async (req, res) => {
  let { locations } = req.query;
  try {
    
console.log("ccccode", req.query);
const jsonArray = await csv().fromFile("public/static/get_urls.csv");
let ary = json2array(jsonArray);
if (ary && ary.length) {
  let i = 0;

  if (locations) {
    console.log("locations", encodeURI(locations));
    let index = ary.findIndex((x) =>
      replaceAll(replaceAll(x.url.replace("https://www.leboncoin.fr/recherche/", ""), "|", ","), "+", "%20").includes(
        "=" + replaceAll(encodeURI(locations), "'", "%27")
      )
    );

    console.log("index", index);
    if (index != -1 && ary[index + 1]) {
      await res.send(replaceAll(ary[index + 1].url, "|", ","));
    } else {
      res.send("END");
    }
  } else {
    await res.send(replaceAll(ary[0].url, "|", ","));
  }
}else{
res.send('script 1 done!');
  }} catch (err) {
    console.log(err);
  }
};

const removeDuplicateAnnonces = async (req, res) => {
  try {
    let data = req.body;
    const fileDataPhone = JSON.parse(fs.readFileSync("announcesWithPhone.json"));

    const fileData = JSON.parse(fs.readFileSync("announces.json"));
    let index = null;
    moment.locale("fr");
    let str = data.date;
    let newStr = str.substring(0, 10).split("/");
    let date = newStr[2] + "-" + newStr[1] + "-" + newStr[0];

    let currentDate = moment(new Date());
    let compare = currentDate.diff(moment(date), "days");
   
      for (let i = 0; i < fileData.length; i++) {
        if (!fileData[i].phone && data && data.link && data.phone && fileData[i].linkAnnonce.includes(data.link)) {
          fileData[i].phone = data.phone;
          fileDataPhone.push(fileData[i]);
          console.log("phone added");
 if (compare <= 3) {          
let params = {
            id: Date.parse(new Date()) / 1000,
            linkAnnonce: fileData[i].linkAnnonce,
            typeBiens: fileData[i].typeBiens,
            title: fileData[i].title,
            city: fileData[i].city,
            postalCode: fileData[i].postalCode,
            phone: replaceAll(data.phone, " ", ""),
            price: replaceAll(fileData[i].price, "??", "").replace("???", ""),
            city_id: fileData[i].city_id,
            user_id: fileData[i].user_id,
          };
          await apiCall(params);

          fs.writeFileSync("announcesWithPhone.json", JSON.stringify(_.uniqWith(fileDataPhone, _.isEqual), null, 2));
}
        }
console.log(data.link && fileData[i].linkAnnonce.includes(data.link))
console.log(data.link)
        if (data.link && fileData[i].linkAnnonce.includes(data.link)) {
          await fileData.splice(i, 1);
        }
        //await fileData.splice(i,1);
      }
    
    fs.writeFileSync("announces.json", JSON.stringify(fileData, null, 2));

    res.send("Phone added to CSV");
  } catch (err) {
    console.log(err);
  }
};

const getAnnonce = async (req, res) => {
  try {
    if (req.query && req.query.next) {
      const fileData = JSON.parse(fs.readFileSync("announces.json"));
      if (fileData[0]) {
        let link = fileData[0].linkAnnonce;

        res.status(200).json({ link: link });
      } else {
        const annonces = JSON.parse(fs.readFileSync("announcesWithPhone.json"));
        if (annonces && annonces.length > 0) {
          // for (let i = 0; i < annonces.length; i++) {
          //   let params = {
          //     id: Date.parse(new Date()) / 1000,
          //     linkAnnonce: annonces[i].linkAnnonce,
          //     typeBiens: annonces[i].typeBiens,
          //     title: annonces[i].title,
          //     city: annonces[i].city,
          //     postalCode: annonces[i].postalCode,
          //     phone: annonces[i].phone,
          //     price: annonces[i].price,
          //     city_id: annonces[i].city_id,
          //     user_id: annonces[i].user_id,
          //   };
          //   apiCall(params);
          // }
          fs.writeFileSync("announcesWithPhone.json", JSON.stringify([], null, 1));
          //fs.writeFileSync("announces.json", [], null, 2);
        }
        res.send("Scrapping done!");
      }
    } else {
      res.send("next api");
    }
  } catch (err) {
    console.log(err);
  }
};

const sendDataToserver = async (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync("announcesWithPhone.json"));
    for (let i = 0; i < fileData.length; i++) {
      await apiCall(fileData[i]);
      console.log("data");
    }
    res.send("done");
  } catch (err) {
    console.log(err);
  }
};

const apiCall = async (data) => {
  console.log("priceee", data.price);
  await axios
    .post("https://www.texto-immo.com/controllers/api/import-json.php", {
      list_id: data.id, // ID de l'annonce
      title: data.title, //Titre
      user_id: data.user_id, // ID user (user_id) r??cup??r?? lors du get-urls.php
      city_id: data.city_id, // ID city (city_id) r??cup??r?? lors du get-urls.php
      url: data.linkAnnonce, // URL de l'annonce
      price: data.price ? data.price : "", // prix du bien
      phone: data.phone, // Num??ro de tel
      type: data.typeBiens, // Type de bien (Appartement, Maison, Parking ...)
      provider: "leboncoin",
    })
    .then(function (response) {
      console.log("sent!", response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

function json2array(json) {
  var result = [];

  var keys = Object.keys(json);
  keys.forEach(function (key) {
    result.push(json[key]);
  });
  return result;
}

module.exports = {
  exportAnnonces,
  removeDuplicateAnnonces,
  getAnnonce,
  sendDataToserver,
  getUrls,
};
