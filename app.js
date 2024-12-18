const express = require("express");
const app = express();
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const messageRouter = require('./routes/messageRouter');
const session = require('express-session');
const passport = require('passport');


app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(express.static(assetsPath));
app.use(session({ secret: "cats", resave: false, saveUninitialized: false}));
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next();
})
app.use("/", messageRouter);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen( PORT, () => {
  console.log(`Running: ${PORT}`);
});
