const pg = require("pg");
const connectionString =
  process.env.DATABASE_URL || "postgres://localhost:5432/squeegee";

const pool = new pg.Pool({ connectionString: connectionString });

pool.query(
  `
  CREATE TABLE url (
    id SERIAL PRIMARY KEY,
    url VARCHAR(200) not null,
    date_created TIMESTAMP not null,
    last_scraped_date TIMESTAMP not null,
    value VARCHAR(100) not null,
    previous_value VARCHAR(100),
    value_dom_context VARCHAR(200) not null,
    value_updated BOOLEAN not null,
    value_updated_date TIMESTAMP not null,
    data_acquired BOOLEAN not null
  )
`,
  (err, res) => {
    console.log(err, res);
    pool.end();
  }
);
