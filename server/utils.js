exports.dbFormatedDate = new Date()
  .toISOString()
  .replace(/T/, " ")
  .replace(/\..+/, "");
