const pg = require("pg");
const { dbFormatedDate } = require("../utils.js");

const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/squeegee";
const pool = new pg.Pool({ connectionString: connectionString });

exports.create = (request, response) => {
  const { url, value, value_xpath } = request.body;

  const query = {
    text:
      "INSERT INTO url(url, date_created, last_scraped_date, value, previous_value, value_xpath, value_updated, value_updated_date, data_acquired) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)",
    values: [
      url,
      `${dbFormatedDate}`,
      `${dbFormatedDate}`,
      value,
      "",
      value_xpath,
      false,
      `${dbFormatedDate}`,
      false,
    ],
  };

  pool.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(201).json({ status: "success", message: "Url added" });
  });
};

exports.findAll = (request, response) => {
  pool.query("SELECT * FROM url", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

exports.delete = (request, response) => {
  pool.query(
    `DELETE FROM url WHERE id='${request.params.id}'`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json({ staus: "success", message: "Url deleted" });
    }
  );
};
