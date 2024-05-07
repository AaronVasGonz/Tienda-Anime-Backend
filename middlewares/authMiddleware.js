const express = require('express');
require('dotenv').config();
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { getAdminRoleFromDb, getUserFromDb } = require('../functions/dbFunctions');
const { verifyUser } = require('../functions/jwt');

// Create database connection
const connection = mysql.createConnection(config);

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  // Get authorization token from request header
  const accessToken = req.headers['authorization'];

  // If token is not provided, return authentication error
  if (!accessToken) {
    return res.status(401).json({ error: "Authorization token not provided" });
  }

  try {
    // Verify authorization token
    const { correo, ...userObject } = await verifyUser(accessToken);

    // If email is invalid, return invalid credentials error
    if (!correo) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Query the database to verify credentials
    const results = await getUserFromDb(connection, correo);

    // If credentials are invalid, return invalid credentials error
    if (results.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Add email to user object and store it in the request
    Object.assign(userObject, { correo });
    req.user = userObject;

    // Pass to the next middleware
    next();

  } catch (error) {
    // If there's an error verifying the token, return invalid token error
    console.error(error);
    return res.status(403).json({ error: "Invalid token" });
  }
};

module.exports = authMiddleware;

