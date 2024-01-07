import express from "express";

import { createUser, getUserByEmail } from "../db/users";
import { random, authentication } from "../helpers";

// Login
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }
    // Authentikasi salt dan password berdasarkan email.
    const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
    const expectedHash = authentication(user.authentication.salt, password);
 
    if (!user) {
      return res.sendStatus(400);
    }
    
    
    if (user.authentication.password != expectedHash) {
      console.log(expectedHash);
      return res.sendStatus(403);
    }
    
    const salt = random();
    user.authentication.sessionToken = authentication(salt, user._id.toString());
    
    await user.save();
    res.cookie('BOOKIE', user.authentication.sessionToken, { domain: 'localhost', path:'/'});
    
    console.log(expectedHash);
    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// Register
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
