import Users from "../models/userModel.js";
import { compareString, createJWT, hashString } from "../utils/index.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;

  //validate fields
  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required"
    });
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: "failed",
        message: "Email address already exists"
      });
    }

    const hashedPassword = await hashString(password);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    user.password = undefined;

    res.status(201).json({
      success: true,
      status: "success",
      message: "Registration successful",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message || "Something went wrong"
    });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      return next("Email and password are required");
    }

    // find user by email
    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      return next("Invalid email or password");
    }

    // compare password
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      return next("Invalid email or password");
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
