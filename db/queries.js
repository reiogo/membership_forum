const pool = require('./pool');

async function addNewUser(username, firstname, lastname, password) {
  pool.query("INSERT INTO members (username, firstname, lastname, password) VALUES ($1, $2, $3, $4)", [
    email,
    firstname,
    lastname,
    password
  ]);
}

module.exports = {
  addNewUser
}
