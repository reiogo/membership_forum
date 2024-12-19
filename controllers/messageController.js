const bcrypt = require('bcryptjs');
const passport = require("passport");
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries.js');
const { body, validationResult } = require('express-validator');

const links = [
  { href: "/", text: "Home" },
  { href: "sign-up", text: "Sign up" },
  { href: "login", text: "Log in" },
];

const validateUser = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Email must follow correct formatting")
    .custom(async(value)=>{
      const checkUsername = await db.checkUsername(value);
      console.log(checkUsername);
      return !checkUsername;
    })
    .withMessage("Email already registered"),
  body("password")
    .isLength({min:3})
    .withMessage("Password is minimum 3 characters long"),
  body("confirm_password")
    .custom((value, {req}) => {
      return value === req.body.password;
    })
    .withMessage("Passwords did not match")

];

async function createIndex(req, res) {
  const messages = await db.getAllMessages();
  console.log(messages);
  res.render("index", {title: "Messageboard", links: links, messages: messages});

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

function createMember (req, res) {
  res.render('member', {
                    title: "Join the club",
                    links: links
  });
}

async function makeMember (req, res) {
  if (req.body.passcode == "123" && req.session.passport.user) {
      await db.changeMemberStatus(true, req.session.passport.user);
  }
  
  res.redirect("/")
}

const logIn = 
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failure"
  })


const logOut = (req, res, next) => {
    req.logOut((err)=> {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await db.getUser(username);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

async function processMessage (req, res) {
  const { title, message } = req.body;
  const id = req.session.passport.user;
  await db.addMessage(title, message, id);
  res.redirect("/");

}

module.exports = {
  processMessage,
  logIn,
  logOut,
  makeMember,
  createIndex,
  createMember,
  createLogin,
  createSignUp,
  postNewUser,
  
};
