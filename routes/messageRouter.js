const { Router } = require('express');
const messageRouter = Router();
const messageController = require('../controllers/messageController');

const passport = require("passport");
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries.js');
const bcrypt = require('bcryptjs');

messageRouter.get("/", messageController.getAllMessages);
messageRouter.get("/sign-up", messageController.createSignUp);
messageRouter.post("/sign-up", messageController.postNewUser);
messageRouter.get("/login", messageController.createLogin);
messageRouter.post(
  "/login", 
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/failure"
  })
);
messageRouter.get("/logout", (req, res, next) => {
    req.logOut((err)=> {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  }
);

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

 

module.exports = messageRouter;
