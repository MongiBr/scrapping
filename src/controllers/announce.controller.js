const { writeToCSVFile, removeDuplicate } = require("../middlewares/writeToCSVFile");

const exportAnnonces = async (req, res) => {
  try {
    let data = req.body;
    window.alert("Don't close this tab");
    await writeToCSVFile(data, `Announces`);
    removeDuplicate("public/static/Announces.csv", res);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  exportAnnonces,
};
