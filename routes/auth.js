import { Router } from "express";
import validateAuthBody from "../middlewares/validateAuthBody.js";
import {
  checkIfUsernameExists,
  isRoleCorrect,
  registerUser,
} from "../services/users.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = Router();

// LOGIN
router.post("/login", validateAuthBody, async (req, res, next) => {
  const { username, password } = req.body;

  const user = await checkIfUsernameExists(username);

  if (user) {
    const isMatching = await bcrypt.compare(password, user.password);
    if (isMatching) {
      const payload = { userId: user.userId, role: user.role };
      const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
        expiresIn: 60 * 10,
      });

      res.json({
        success: true,
        message: `Welcome back, ${user.username}`,
        userId: user.userId,
        token: `Bearer ${token}`,
      });
    } else {
      next({
        status: 401,
        message: "Wrong username or password",
      });
    }
  } else {
    next({
      status: 401,
      message: "Wrong username or password",
    });
  }
});

// REGISTER
router.post("/register", validateAuthBody, async (req, res, next) => {
  const { username, password, role } = req.body;
  const isUsernameTaken = await checkIfUsernameExists(username);

  if (isUsernameTaken) {
    next({
      status: 409,
      message: "Username already taken",
    });
    return;
  }

  const correctRole = await isRoleCorrect(role);
  if (!correctRole) {
    next({
      status: 400,
      message: "Provide a role that is either 'admin' or 'user'",
    });
    return;
  }

  const newUser = await registerUser(username, password, role);

  if (newUser) {
    res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        username,
        userId: newUser.userId,
      },
    });
  } else {
    next({
      status: 500,
      message: "Could not register new user",
    });
  }
});

// LOGOUT
router.get("/logout", (_req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

export default router;
