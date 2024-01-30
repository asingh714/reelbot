import validator from "validator";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

import { createTokenUser } from "./utils/createTokenUser.js";
import { attachCookiesToResponse } from "./utils/jwt.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      msg: "Please provide email, password, and username to register",
    });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters long" });
  }

  const isEmailValid = validator.isEmail(email);
  if (!isEmailValid) {
    return res.status(400).json({ msg: "Please provide a valid email" });
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("email")
      .eq("email", email);

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: userData, error: insertError } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword }])
      .select();

    if (insertError) {
      throw insertError;
    }

    const user = createTokenUser(userData[0]);

    attachCookiesToResponse({ res, user });
    res
      .status(201)
      .json({ username: userData[0].username, email: userData[0].email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
};
