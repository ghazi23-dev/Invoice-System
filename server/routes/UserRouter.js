const express = require("express");
const UserRouter = express.Router();
const UserController = require("../controllers/UserController");
const authenticateToken = require("../middleware/middleware");

UserRouter.post("/api/v1/adduser", UserController.addUser);
UserRouter.get("/api/v1/getuser/:UserEmail",authenticateToken, UserController.getUserbyEmail);
UserRouter.post("/api/v1/login", UserController.login);
UserRouter.get("/api/v1/checktoken",authenticateToken, UserController.checkToken);
UserRouter.post("/api/v1/logout", authenticateToken,UserController.logout);
UserRouter.get("/api/v1/getallusers",authenticateToken, UserController.getallUsers);
UserRouter.get("/api/v1/getuserbyid/:User_ID",authenticateToken, UserController.getuserbyid);
UserRouter.delete("/api/v1/deleteuser/:User_ID",authenticateToken, UserController.deleteuser);
UserRouter.put("/api/v1/updateuser/",authenticateToken, UserController.updateuser);
UserRouter.post("/api/v1/activateuser/:User_ID",authenticateToken, UserController.activateuser);
UserRouter.get("/api/v1/getSuperAdmin",authenticateToken, UserController.getSuperAdmin);
UserRouter.get("/api/v1/getAgent",authenticateToken, UserController.getAgent);





module.exports = UserRouter;