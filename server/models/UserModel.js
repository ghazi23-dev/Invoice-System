const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

class UserModel {
  static async addUser(
    UserName,
    fullname,
    UserEmail,
    Role,
    Password,
    Agency_ID,
    DateOfBirth
  ) {
    const hashedPassword = await bcrypt.hash(Password, 10);
    try {
      // Check if the user already exists by email
      const existingUser = await prisma.user.findUnique({
        where: {
          UserEmail: UserEmail,
        },
      });

      if (existingUser) {
        // User already exists
        return { success: false, message: "User already exists" };
      } else {
        // User doesn't exist, proceed with insertion
        const newUser = await prisma.user.create({
          data: {
            UserName: UserName,
            fullname: fullname,
            UserEmail: UserEmail,
            Role: Role,
            Password: hashedPassword,
            Agency_ID: Agency_ID,
            created_at: new Date(),
            DateOfBirth: DateOfBirth,
          },
        });
        return { success: true, user: newUser };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getUserbyEmail(UserEmail) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          UserEmail: UserEmail,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async login(UserEmail, Password) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          UserEmail: UserEmail,
        },
      });

      if (!user) {
        return { success: false, message: "User not found" };
      }
      if (user.tag_actif !== 1) {
        return { success: false, message: "User is deactivated" };
      }
      const passwordMatch = await bcrypt.compare(Password, user.Password);

      if (passwordMatch) {
        return { success: true, user: user };
      } else {
        return { success: false, message: "Invalid password" };
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async getallUsers() {
    try {
      const users = await prisma.user.findMany();
      // Convert the dates to strings in the local timezone
      users.forEach(user => {
        if (user.dateField) { // Replace 'dateField' with the name of your date field
          user.dateField = user.dateField.toLocaleString();
        }
      });
      return users;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  

  static async getuserbyid(User_ID) {
    try {
      const user = await prisma.user.findMany({
        where: {
          User_ID: parseInt(User_ID),
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async deleteuser(User_ID) {
    try {
      const user = await prisma.user.delete({
        where: {
          User_ID: parseInt(User_ID),
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async updateuser(
    User_ID,
    UserName,
    fullname,
    UserEmail,
    Role,
    Password,
    Agency_ID,
    DateOfBirth
  ) {
    try {
      const user = await prisma.user.update({
        where: {
          User_ID: parseInt(User_ID),
        },
        data: {
          UserName: UserName,
          fullname: fullname,
          UserEmail: UserEmail,
          Role: Role,
          Password: Password,
          Agency_ID: Agency_ID,
          DateOfBirth: DateOfBirth,
        },
      });
      return user; // return the updated user
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async activateuser(User_ID) {
    try {
      // First, fetch the current status of the user
      const currentUser = await prisma.user.findUnique({
        where: {
          User_ID: parseInt(User_ID),
        },
        select: {
          tag_actif: true,
        },
      });

      if (!currentUser) {
        console.error("User not found");
        throw new Error("User not found");
      }

      // Toggle the user's activation status
      const newStatus = currentUser.tag_actif === 1 ? 0 : 1;

      // Update the user's status in the database
      const updatedUser = await prisma.user.update({
        where: {
          User_ID: parseInt(User_ID),
        },
        data: {
          tag_actif: newStatus,
        },
      });

      console.log(
        `User ${newStatus === 0 ? "desactivated" : "activated"} successfully`
      );
      return updatedUser;
    } catch (error) {
      console.error("Error updating user activation status:", error);
      throw error;
    }
  }

  static async getSuperAdmin() {

    try {
      const user = await prisma.user.findMany({
        where: {
          Role: "SuperAdmin",
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async getAgent() {
    try {
      const user = await prisma.user.findMany({
        where: {
          Role: "Agent",
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

}
module.exports = UserModel;
