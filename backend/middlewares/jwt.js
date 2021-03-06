"use strict";
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  //Token will be issue with the given payload and expire time
  issue(payload, expiresIn) {
    return jwt.sign(payload, process.env.jwtSecret, {
      expiresIn: expiresIn ? expiresIn : "3d",
    });
  },
  verify(token) {
    try {
      return jwt.verify(token, process.env.jwtSecret); //
    } catch (err) {
      return false;
    }
  },
};
