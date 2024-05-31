const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserController {
  static async addUser(req, res) {
    try {
      const {
        UserName,
        fullname,
        UserEmail,
        Role,
        Password,
        Agency_ID,
        DateOfBirth,
      } = req.body;

      const newUser = await UserModel.addUser(
        UserName,
        fullname,
        UserEmail,
        Role,
        Password,
        Agency_ID,
        DateOfBirth
      );

      if (newUser.success) {
        res
          .status(201)
          .json({ message: "User added successfully!", user: newUser.user });
      } else {
        res.status(400).json({ error: newUser.message });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while saving the user to the database",
      });
    }
  }

  static async getUserbyEmail(req, res) {
    try {
      const user = await UserModel.getUserbyEmail(req.params.UserEmail);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the user from the database",
      });
    }
  }

  static async login(req, res) {
    try {
      const { UserEmail, Password } = req.body;
      const login = await UserModel.login(UserEmail, Password);

      if (login.success) {
        const { User_ID, UserName, fullname, Role, Agency_ID } = login.user;
        const token = jwt.sign(
          { User_ID, UserName, fullname, UserEmail, Role, Agency_ID },
          "secret",
          { expiresIn: "1h" }
        );
        res.cookie("token", token, { httpOnly: true });
        res.json({ success: true, user: login.user, token: token });
      } else {
        if (login.message === "User not activated") {
          res.status(401).json({ error: "User not activated" });
        } else {
          res.status(401).json({ error: login.message });
        }
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "There was an error while logging in" });
    }
  }

  static async logout(_, res) {
    res.clearCookie("token");
    return res.json({ Status: "Success" });
  }

  static async checkToken(req, res) {
    try {
      const token = req.cookies.token;
      if (!token) {
        return res
          .status(401)
          .json({ error: "Unauthorized: No token provided" });
      }
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Unauthorized" });
        }
        res.json(decoded);
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "There was an error while checking the token" });
    }
  }

  static async getallUsers(req, res) {
    try {
      const users = await UserModel.getallUsers();
      res.json(users);
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "There was an error while fetching the users" });
    }
  }

  static async getuserbyid(req, res) {
    try {
      const user = await UserModel.getuserbyid(req.params.User_ID);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the user from the database",
      });
    }
  }

  static async deleteuser(req, res) {
    try {
      const user = await UserModel.deleteuser(req.params.User_ID);
      if (user) {
        res.json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the user from the database",
      });
    }
  }

  static async updateuser(req, res) {
    try {
      const {
        User_ID,
        UserName,
        fullname,
        UserEmail,
        Role,
        Password,
        Agency_ID,
        DateOfBirth,
      } = req.body;

      let hashedPassword;
      const existingUser = await UserModel.getuserbyid(User_ID);

      // Only rehash the password if it has been changed
      if (req.body.Password && req.body.Password !== "null") {
        hashedPassword = await bcrypt.hash(Password, 10);
      } else {
        hashedPassword = existingUser.Password;
      }

      const user = await UserModel.updateuser(
        User_ID,
        UserName,
        fullname,
        UserEmail,
        Role,
        hashedPassword,
        Agency_ID,
        DateOfBirth
      );
      if (user) {
        res.json({
          message: "User updated successfully",
          user: user,
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while updating the user in the database",
      });
    }
  }

  static async activateuser(req, res) {
    try {
      const updatedUser = await UserModel.activateuser(req.params.User_ID);
      if (updatedUser) {
        // Prepare a message based on the user's new activation status
        const message =
          updatedUser.tag_actif === 1
            ? "User activated successfully"
            : "User deactivated successfully";

        // Return the updated user and the message
        res.json({ user: updatedUser, message: message });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the user from the database",
      });
    }
  }

  static async getSuperAdmin(req, res) {

    try {
      const superAdmin = await UserModel.getSuperAdmin();
      if(superAdmin){
      res.json(superAdmin);
      }else{
        res.status(404).json({ error: "Super Admin not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        error: "There was an error while fetching the super admin from the database",
      });
    }
  }

  static async getAgent(req, res) {
      
      try {
        const agent = await UserModel.getAgent();
        if(agent){
        res.json(agent);
        }else{
          res.status(404).json({ error: "Agent not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({
          error: "There was an error while fetching the agent from the database",
        });
      }
    }
}

module.exports = UserController;
