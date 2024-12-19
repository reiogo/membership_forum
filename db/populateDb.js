#! /user/bin/env node
const path = require("path");
require("dotenv").config({path: path.resolve(__dirname, '../.env')});

const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS members (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR (255) UNIQUE,
  first_name VARCHAR (255),
  last_name VARCHAR (255),
  password  VARCHAR (255),
  membership BOOLEAN DEFAULT FALSE,
  admin BOOLEAN DEFAULT FALSE
  );

CREATE TABLE IF NOT EXISTS messages (
  message_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  message_title VARCHAR (255),
  message_text TEXT,
  message_time TIMESTAMP DEFAULT current_timestamp,
  author_id INTEGER,
  FOREIGN KEY (author_id)
    REFERENCES members(id)
    );

`;

async function main() {
  console.log("seeding");
  const client = new Client({
    connectionString: `postgresql://reiro:${process.env.PGPASSWORD}@localhost/top_member`
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done")
}

main();

