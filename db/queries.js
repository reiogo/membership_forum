const pool = require('./pool');

async function addNewUser(email, first_name, last_name, password) {
  await pool.query("INSERT INTO members (username, first_name, last_name, password) VALUES ($1, $2, $3, $4)", [
    email,
    first_name,
    last_name,
    password
  ]);
}

async function getUser(email) {
  const { rows } = await pool.query("SELECT * FROM members WHERE username = $1", [email]);
  return rows[0];
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
  return rows[0];
}

module.exports = {
  getUserById,
  addNewUser,
  getUser
}
