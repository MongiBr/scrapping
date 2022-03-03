const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const request = require("request");
const fs = require("fs");
const http = require("http");
const https = require("https");
const compress_images = require("compress-images");
const csv = require("csvtojson");
const uuid = require("uuid");

var downloadXBOX = function (uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
};

const removeDuplicate = async function (pathFile, response) {
  const jsonArray = await csv().fromFile(pathFile);
  let ary = json2array(jsonArray);

  console.log(ary.length);
  for (let i = 0; i < ary.length; i++) {
    if (ary[i].sku.includes("Windows")) {
      ary.splice(i, 1);
    }

    if (ary[i].description.includes("Windows")) {
      ary[i].description.replace("Windows", "");
      ary[i].description.replace("windows", "");
    }
    if (ary[i].short_description.includes("Windows")) {
      ary[i].short_description.replace("Windows", "");
      ary[i].short_description.replace("windows", "");
    }
    if (ary[i].sku.includes("Xbox")) {
      let index = ary[i].sku.indexOf("Xbox");
      ary[i].sku = ary[i].sku.slice(0, index);
    }

    if (ary[i].name.includes("Xbox")) {
      let index = ary[i].name.indexOf("Xbox");
      ary[i].name = ary[i].name.slice(0, index);
    }

    for (let j = i + 1; j < ary.length; j++) {
      if (ary[j].sku == ary[i].sku) {
        ary.splice(j, 1);
      }
    }
  }
  console.log(ary);
  console.log(ary.length);
  let res = await writeToCSVFile(ary, "xboxFile");
  return response.download("public/static/xboxFile.csv");
};

var download = function (uri, filename, callback) {
  const file = fs.createWriteStream(filename);

  var req = https.get(uri, function (response) {
    response.pipe(file);
  });
  req.end();
  return req;
};

function compress(pathImage, pathCompress) {
  compress_images(
    pathImage,
    pathCompress,
    { compress_force: false, statistic: true, autoupdate: true },
    false,

    function (err, completed) {
      if (completed === true) {
        // Doing something.
      }
    }
  );
}

async function writeToCSVFile(products, file) {
  try {
    const csvWriter = createCsvWriter({
      path: `public/static/${file}.csv`,
      header: [
        { id: "sku", title: "sku" },
        { id: "store_view_code", title: "store_view_code" },
        { id: "attribute_set_code", title: "attribute_set_code" },
        { id: "product_type", title: "product_type" },
        { id: "categories", title: "categories" },
        { id: "product_websites", title: "product_websites" },
        { id: "name", title: "name" },
        { id: "description", title: "description" },
        { id: "short_description", title: "short_description" },
        { id: "weight", title: "weight" },
        { id: "product_online", title: "product_online" },
        { id: "tax_class_name", title: "tax_class_name" },
        { id: "visibility", title: "visibility" },
        { id: "price", title: "price" },
        { id: "base_image", title: "base_image" },
        { id: "base_image_label", title: "base_image_label" },
        { id: "small_image", title: "small_image" },
        { id: "small_image_label", title: "small_image_label" },
        { id: "thumbnail_image", title: "thumbnail_image" },
        { id: "thumbnail_image_label", title: "thumbnail_image_label" },
        { id: "swatch_image", title: "swatch_image" },
        { id: "swatch_image_label", title: "swatch_image_label" },
        { id: "additional_attributes", title: "additional_attributes" },
        { id: "meta_title", title: "meta_title" },
        { id: "meta_keywords", title: "meta_keywords" },
        { id: "meta_description", title: "meta_description" },
        { id: "qty", title: "qty" },
        { id: "is_in_stock", title: "is_in_stock" },
        { id: "website_id", title: "website_id" },
      ],
    });
    let result;
    if (file.includes("File")) {
      await csvWriter.writeRecords(products).then(() => console.log("The CSV file was written successfully"));
    } else {
      if (file.includes("xbox")) {
        result = extractAsCSV(products);
      } else if (file.includes("nintendo")) {
        result = extractAsCSVNintendo(products);
      } else if (file.includes("ps")) {
        result = extractAsCSVPs(products);
      }
      await csvWriter.writeRecords(result).then(() => console.log("The CSV file was written successfully"));
    }

    let res = `public/static/${file}.csv`;
    return res;
  } catch (err) {
    console.log(err);
  }
}

function extractAsCSV(products) {
  const data = json2array(products);
  let xbox = data[0];
  let result = [];

  for (let i = 0; i < xbox.length; i++) {
    let images = [];
    const idImg = uuid.v1();
    let index = 0;
    let media = xbox[i].LocalizedProperties[0].Images;
    for (let j = 0; j < media.length; j++) {
      console.log(media[j].ImagePurpose);
      if (media[j].ImagePurpose == "Poster") {
        index = j;
      }
    }

    if (index > 0) {
      try {
        download(`https:${media[index].Uri}`, `public/img/xbox/product_${idImg}.jpg`, function () {
          console.log("poster n", index);
        });
      } catch (err) {
        console.log("error :", err);
      }
    } else {
      download(`https:${media[0].Uri}`, `public/img/xbox/product_${idImg}.jpg`, function () {
        console.log("poster n", 0);
      });
    }
    if (media[index].Uri) {
      result.push({
        sku: xbox[i].ProductId.slice(0, 59),
        store_view_code: "default",
        attribute_set_code: "Jeux video, Consoles, Gift cards, accessoires",
        product_type: "configurable",
        categories:
          "Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux Video,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Console",
        product_websites: "base",
        name: xbox[i].LocalizedProperties[0].ProductTitle,
        description: xbox[i].LocalizedProperties[0].ProductDescription,
        short_description: xbox[i].LocalizedProperties[0].ShortDescription,
        weight: "",
        product_online: 1,
        tax_class_name: "Taxable Goods",
        visibility: "Catalog, Search",
        price: xbox[i].DisplaySkuAvailabilities[0].Availabilities[0].OrderManagementData.Price.ListPrice,
        base_image: `img/xbox/product_${idImg}.jpg`,
        base_image_label: "",
        small_image: `img/xbox/product_${idImg}.jpg`,
        small_image_label: "",
        thumbnail_image: `img/xbox/product_${idImg}.jpg`,
        thumbnail_image_label: "",
        swatch_image: `img/xbox/product_${idImg}.jpg`,
        swatch_image_label: "",
        additional_attributes: "boite=Comme neuf,etat=Neuf,language=English,marque_jeux_video_consoles_gif=PC,region=America",
        qty: 1000,
        is_in_stock: 1,
        website_id: 0,
        meta_title: xbox[i].LocalizedProperties[0].ProductTitle,
        meta_keywords: xbox[i].LocalizedProperties[0].ProductTitle,
        meta_description: xbox[i].LocalizedProperties[0].ProductTitle,
      });
    }
  }
  console.log("length :", xbox.length);
  return result;
}

function extractAsCSVNintendo(products) {
  const data = json2array(products);
  let xbox = data[0][0].hits;
  let result = [];

  for (let i = 0; i < xbox.length; i++) {
    let images = [];
    const idImg = uuid.v1();
    if (xbox[i].horizontalHeaderImage) {
      try {
        download(xbox[i].horizontalHeaderImage, `public/img/nintendo/product_img_${idImg}.jpg`, function () {
          console.log("waiting...");
        });
      } catch (err) {
        console.log("error image :", err);
      }

      result.push({
        sku: xbox[i].slug.slice(0, 59),
        store_view_code: "default",
        attribute_set_code: "Jeux video, Consoles, Gift cards, accessoires",
        product_type: "configurable",
        categories:
          "Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux Video,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Console",
        product_websites: "base",
        name: xbox[i].title,
        description: xbox[i].description,
        short_description: xbox[i].description,
        weight: "",
        product_online: 1,
        tax_class_name: "Taxable Goods",
        visibility: "Catalog, Search",
        price: 10,
        base_image: `img/nintendo/product_img_${idImg}.jpg`,
        base_image_label: "",
        small_image: `img/nintendo/product_img_${idImg}.jpg`,
        small_image_label: "",
        thumbnail_image: `img/nintendo/product_img_${idImg}.jpg`,
        thumbnail_image_label: "",
        swatch_image: `img/nintendo/product_img_${idImg}.jpg`,
        swatch_image_label: "",
        additional_attributes: "boite=Comme neuf,etat=Neuf,language=English,marque_jeux_video_consoles_gif=PC,region=America",
        qty: 1000,
        is_in_stock: 1,
        website_id: 0,
        meta_title: xbox[i].title,
        meta_keywords: xbox[i].title,
        meta_description: xbox[i].title,
      });
    } else {
      console.log("no image");
    }
  }
  console.log("length :", xbox.length);
  return result;
}

function extractAsCSVPs(products) {
  const data = json2array(products);
  let xbox = data[0].categoryGridRetrieve.products;
  console.log(xbox);
  let result = [];
  for (let i = 0; i < xbox.length; i++) {
    const idImg = uuid.v1();
    let media = xbox[i].media;
    let index = 0;
    for (let j = 0; j < media.length; j++) {
      if (media[j].role == "MASTER") {
        index = j;
      }
    }
    if (media[index].url) {
      download(media[index].url, `public/img/ps/product_img_${idImg}.jpg`, function () {
        console.log("waiting...");
      });
      let ind;
      let name = xbox[i].name;
      console.log(xbox[i].name);
      if (xbox[i].name.indexOf("for PS") != -1) {
        ind = xbox[i].name.indexOf("for");
        name = xbox[i].name.slice(0, ind - 1);
      } else if (xbox[i].name.indexOf("- PS") != -1) {
        ind = xbox[i].name.indexOf("- PS");
        name = xbox[i].name.slice(0, ind - 1);
      } else if (xbox[i].name.indexOf("PS") != -1) {
        ind = xbox[i].name.indexOf("PS");
        name = xbox[i].name.slice(0, ind - 1);
      }

      result.push({
        sku: xbox[i].id.slice(0, 59),
        store_view_code: "default",
        attribute_set_code: "Jeux video, Consoles, Gift cards, accessoires",
        product_type: "configurable",
        categories:
          "Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux Video,Default Category/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Jeux video&#44; Consoles&#44; Gift cards&#44; accessoires/Console",
        product_websites: "base",
        name: name,
        description: name,
        short_description: name,
        weight: "",
        product_online: 1,
        tax_class_name: "Taxable Goods",
        visibility: "Catalog, Search",
        price: 10,
        base_image: `img/ps/product_img_${idImg}.jpg`,
        base_image_label: "",
        small_image: `img/ps/product_img_${idImg}.jpg`,
        small_image_label: "",
        thumbnail_image: `img/ps/product_img_${idImg}.jpg`,
        thumbnail_image_label: "",
        swatch_image: `img/ps/product_img_${idImg}.jpg`,
        swatch_image_label: "",
        additional_attributes: "boite=Comme neuf,etat=Neuf,language=English,marque_jeux_video_consoles_gif=PC,region=America",
        qty: 1000,
        is_in_stock: 1,
        website_id: 0,
        meta_title: name,
        meta_keywords: name,
        meta_description: name,
      });
    }
  }
  console.log("length :", xbox.length);
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
