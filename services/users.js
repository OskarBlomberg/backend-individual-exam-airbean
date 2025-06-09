import { v4 as uuidv4 } from "uuid";
import User from "../models/user.js";

export async function checkIfUserExists(userId) {
  try {
    const userExists = await User.findOne({ userId });
    return !!userExists;
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

export async function checkIfUsernameExists(username) {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

export async function registerUser(username, password, role) {
  try {
    let userRole = "user";
    if (role === "admin") {
      userRole = role;
    }
    const shortUuid = uuidv4().split("-")[0];
    const userId = `${userRole}-${shortUuid}`;

    const newUser = new User({
      username,
      password,
      userId,
      role: userRole,
    });

    await newUser.save();

    return newUser;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}
