const bcrypt = require('bcryptjs');
const db = require('../db/queries.js');
const { body, validationResult } = require('express-validator');

const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "Message Submission" },
  { href: "sign-up", text: "Sign up" },
  { href: "login", text: "Log in" }
];

const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must follow correct formatting"),

];

async function getAllMessages(req, res) {
  // const messages = await db.messagesGetAll();
  res.render("index", {title: "Messageboard", links: links});

  // res.render("index", {title: "Mini Messageboard", messages: sample_messages, links: links});
}

async function createSignUp(req, res) {
  res.render("signup", {
                    title: "Signup",
                    links: links
  });
}

postNewUser = [ 
  validateUser, 
  async (req, res, next) => {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
            return res.status(400).render("signup", {
                      title: "Error in Signup",
                      links:links,
                      errors: errors.array(),
                    });
          }
    try {
      const { email, first_name, last_name, password } = req.body;

      bcrypt.hash(password, 10, async(err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        await db.addNewUser(email, first_name, last_name, hashedPassword);
      });
      res.redirect("/")
    } catch(err) {
      return next(err);
    }
  }
]

function createLogin (req, res) {
  res.render('login');
}

module.exports = {
  createLogin,
  createSignUp,
  postNewUser,
  getAllMessages
};
