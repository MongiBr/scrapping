const { writeToCSVFile, addPhoneToCsv, getFromCsv } = require("../middlewares/writeToCSVFile");
const fs = require('fs');
const { default: axios } = require("axios");


const exportAnnonces = async (req, res) => {
  try {
    //console.log(req.body);
    let data = req.body;

    const fileData = JSON.parse(fs.readFileSync('announces.json'))
    data.announces.map(item => fileData.push(item))
    fs.writeFileSync('announces.json', JSON.stringify(fileData, null, 2));
    return res.send("Line added to csv");

  } catch (err) {
    console.log(err);
  }
};

const removeDuplicateAnnonces = async (req, res) => {
  try {
    let data = req.body;
    const fileData = JSON.parse(fs.readFileSync('announces.json'))
    for (let i = 0; i < fileData.length; i++) {
      if (!fileData[i].phone && fileData[i].linkAnnonce.includes(data.link)) {
        fileData[i].phone = data.phone
      }
    }
    fs.writeFileSync('announcesWithPhone.json', JSON.stringify(fileData, null, 2));
    res.send("Phone added to CSV");
  } catch (err) {
    console.log(err);
  }
};

const getAnnonce = async (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync('announces.json'));
    let link = fileData[0].linkAnnonce;
    fileData.shift();
    fs.writeFileSync('announces.json', JSON.stringify(fileData, null, 2));
    res.send(link);
  } catch (err) {
    console.log(err);
  }
};


 const sendDataToserver = async (req, res) => {
  try {
    const fileData = JSON.parse(fs.readFileSync('announcesWithPhone.json'))
    for (let i = 0; i < fileData.length; i++) {
      await apiCall(fileData[i])
    }
    res.send("done");
  } catch (err) {
    console.log(err);
  }
};

const apiCall = async (data) =>{
 await axios.post('https://www.texto-immo.com/controllers/api/import-json.php', {
    list_id: 8888, // ID de l'annonce
    title: data.title, //Titre
    user_id: "", // ID user (user_id) récupéré lors du get-urls.php 
    city_id: data.postalCode, // ID city (city_id) récupéré lors du get-urls.php
    url: data.linkAnnonce, // URL de l'annonce
    price: parseInt(data.price), // prix du bien
    phone: data.phone, // Numéro de tel
    type: data.typeBiens, // Type de bien (Appartement, Maison, Parking ...)
    provider: 'leboncoin'
  })
  .then(function (response) {
    console.log("sent!")
  })
  .catch(function (error) {
    console.log(error);
  });
}



module.exports = {
  exportAnnonces,
  removeDuplicateAnnonces,
  getAnnonce,
  sendDataToserver
};
