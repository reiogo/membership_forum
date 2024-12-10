const db = require('../db/queries.js')
const { body, validationResult } = require('express-validator');
const links = [
  { href: "/", text: "Home" },
  { href: "new", text: "Message Submission" },
];

const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must follow correct formatting"),

];

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
      const { email, firstname, lastname, password } = req.body;
      await db.addNewUser(email, firstname, lastname, password);
      res.redirect("/")
    } catch(err) {
      return next(err);
    }
  }
]
// async function getAllMessages(req, res) {
//   const messages = await db.messagesGetAll();
//   console.log('hello from getall', messages);
//   res.render("index", {title: "Mini Messageboard", messages: messages, links: links});
// }

// async function getMessage (req, res) {
//   const messages = await db.messagesGetSpecific();

//   res.render("message", {
//     title: "Message Info", 
//     messages: messages, 
//     messageId: req.query.id, 
//     links: links});

// }
// async function postMesssage(req, res) {
//   messageUser = req.body.user
//   messageText = req.body.message
//   await db.messagesPostMessage(user, message);
//   res.redirect("/");

// }

module.exports = {
  createSignUp,
  postNewUser
  // getAllMessages,
  // getMessage,
  // postMesssage
};
