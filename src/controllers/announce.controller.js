const { writeToCSVFile, addPhoneToCsv, getFromCsv } = require("../middlewares/writeToCSVFile");
const fs = require("fs");
var _ = require("lodash");
const { default: axios } = require("axios");

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
        let cityAndUser = urls.find(
          (data) =>
            replaceAll(data.url, "|", ",").replace("https://www.leboncoin.fr/recherche/", "") ==
            item.linkRecherche.replace("https://www.leboncoin.fr/recherche", "")
        );
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
        let index = ary.findIndex((x) =>
          replaceAll(replaceAll(x.url.replace("https://www.leboncoin.fr/recherche/", ""), "|", ","), '+', '%20').includes(encodeURI(locations))
        );

        console.log("index", index);
        if (index != -1 && ary[index+1]) {
          await res.send(replaceAll(ary[index + 1].url, "|", ","));
        } else {
          res.send("END");
        }
      } else {
        await res.send(replaceAll(ary[0].url, "|", ","));
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const removeDuplicateAnnonces = async (req, res) => {
  try {
    let data = req.body;
    const fileDataPhone = JSON.parse(fs.readFileSync("announcesWithPhone.json"));

    const fileData = JSON.parse(fs.readFileSync("announces.json"));
    for (let i = 0; i < fileData.length; i++) {
      if (!fileData[i].phone && fileData[i].linkAnnonce.includes(data.link)) {
        fileData[i].phone = data.phone;
        fileDataPhone.push(fileData[i]);
        console.log("phone added");
        fs.writeFileSync("announcesWithPhone.json", JSON.stringify(_.uniqWith(fileDataPhone, _.isEqual), null, 1));
	fileData.splice(i,1);
      }
    }
fs.writeFileSync("announcesWithPhone.json", JSON.stringify(_.uniqWith(fileData, _.isEqual), null, 1));

    res.send("Phone added to CSV");
  } catch (err) {
    console.log(err);
  }
};

const getAnnonce = async (req, res) => {
  try {
	if(req.query && req.query.next){

   		 const fileData = JSON.parse(fs.readFileSync("announces.json"));
    		if (fileData[0]) {
      		let link = fileData[0].linkAnnonce;
      	
      		
      		res.status(200).json({"link" : link});
    		} else {
      			const annonces = JSON.parse(fs.readFileSync("announcesWithPhone.json"));
      			if (annonces && annonces.length > 0) {
        		for (let i = 0; i < annonces.length; i++) {
          			let params = {
            				id: Date.parse(new Date()) / 1000,
            				linkAnnonce: annonces[i].linkAnnonce,
            				typeBiens: annonces[i].typeBiens,
            				title: annonces[i].title,
            				city: annonces[i].city,
            				postalCode: annonces[i].postalCode,
            				phone: annonces[i].phone,
            				price: annonces[i].price,
            				city_id: annonces[i].city_id,
            				user_id: annonces[i].user_id,
          					};
          		apiCall(params);
        		}
        //fs.writeFileSync("announcesWithPhone.json", JSON.stringify([], null, 1));
      		}
      res.send("Scrapping done!");

    }
}else{
res.send('next api');}
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
      user_id: data.user_id, // ID user (user_id) récupéré lors du get-urls.php
      city_id: data.city_id, // ID city (city_id) récupéré lors du get-urls.php
      url: data.linkAnnonce, // URL de l'annonce
      price: data.price ? data.price.replace(" €", "") : "", // prix du bien
      phone: data.phone, // Numéro de tel
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
