const { Router } = require('express');
const messageRouter = Router();
const messageController = require('../controllers/messageController');

const passport = require("passport");
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries.js');
const bcrypt = require('bcryptjs');

messageRouter.get("/", messageController.createIndex);
messageRouter.get("/sign-up", messageController.createSignUp);
messageRouter.post("/sign-up", messageController.postNewUser);
messageRouter.get("/login", messageController.createLogin);
messageRouter.get("/member", messageController.createMember);
messageRouter.post("/member", messageController.makeMember);
messageRouter.post( "/login", messageController.logIn);
messageRouter.get("/logout", messageController.logOut);
messageRouter.post("/newMessage", messageController.processMessage);
messageRouter.post("/delete", messageController.processDelete);


 

module.exports = messageRouter;
