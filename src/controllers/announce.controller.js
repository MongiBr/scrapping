const { writeToCSVFile, addPhoneToCsv, getFromCsv } = require("../middlewares/writeToCSVFile");

const exportAnnonces = async (req, res) => {
  try {
    console.log(req.body);
    let data = req.body;
    await writeToCSVFile(data, `Announces`);
    return res.send("Line added to csv");
  } catch (err) {
    console.log(err);
  }
};

const removeDuplicateAnnonces = async (req, res) => {
  try {
    let data = req.body;
    console.log("data", data);
    await addPhoneToCsv("public/static/Announces.csv", data, res);
    res.send("Phone added to CSV");
  } catch (err) {
    console.log(err);
  }
};

const getAnnonce = async (req, res) => {
  try {
    await getFromCsv("public/static/Announces.csv", res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  exportAnnonces,
  removeDuplicateAnnonces,
  getAnnonce,
};
