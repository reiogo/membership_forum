const pool = require('./pool');

async function addNewUser(email, first_name, last_name, password, isAdmin) {
  await pool.query("INSERT INTO members (username, first_name, last_name, password, admin) VALUES ($1, $2, $3, $4, $5);", [
    email,
    first_name,
    last_name,
    password,
    isAdmin
  ]);
}

async function getUser(email) {
  const { rows } = await pool.query("SELECT * FROM members WHERE username = $1;", [email]);
  return rows[0];
}

async function checkUsername(username) {
  const { rows } = await pool.query("SELECT * FROM members WHERE username = $1;", [username]);
  return rows.length;
}

async function getUserById(id) {
  const { rows } = await pool.query("SELECT * FROM members WHERE id = $1;", [id]);
  return rows[0];
}

async function changeMemberStatus(flag, id) {
  await pool.query("UPDATE members SET membership = $1 WHERE id = $2;", [flag, id]);
}

async function addMessage(title, message, id) {
  await pool.query("INSERT INTO messages(message_title, message_text, author_id) VALUES ($1, $2, $3);", [title, message, id]);
}

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages JOIN members ON author_id = id;");
  return rows;
}

async function deleteMessage(message_id) {
  await pool.query("DELETE FROM messages WHERE message_id = $1", [message_id]);
}

module.exports = {
  deleteMessage,
  getAllMessages,
  addMessage,
  checkUsername,
  changeMemberStatus,
  getUserById,
  addNewUser,
  getUser
}
