const { Router } = require('express');
const messageRouter = Router();
const messageController = require('../controllers/messageController');



// messageRouter.get("/", messageController.getAllMessages);
messageRouter.get("/sign-up", messageController.createSignUp);
messageRouter.post("/sign-up", messageController.postNewUser);

module.exports = messageRouter;
