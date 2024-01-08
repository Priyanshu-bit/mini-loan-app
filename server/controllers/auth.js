import Auth from "../models/auth.js";
import bcrypt from "bcrypt";
import { createToken } from "./utils.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw "incomplete details";
    }

    const user = await Auth.findOne({ email });

    if (!user) {
      throw "No such user found!";
    }

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) {
      throw "Invalid credentials";
    }

    delete user.password;
    const token = createToken(user);
    return res.status(200).json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
};

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) throw "Incomplete details";
    const existingUser = await Auth.findOne({ email });
    if (existingUser) throw "Account already exists!/nPlease Login!!!";
    const hashedPass = await bcrypt.hash(password, 5);
    const user = await Auth.create({ email, password: hashedPass, name });
    delete user.password;
    const token = createToken(user);
    return res
      .status(200)
      .json({ msg: "Account Successfully created", details: user, token });
  } catch (error) {
    console.error(error);
    res.status(400).json(error);
  }
};

export const verifyUser = async (req, res) => {
  return res.status(200).json({user:req.user})
}