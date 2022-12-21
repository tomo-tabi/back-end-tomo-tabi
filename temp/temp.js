// to be merged


// File for Users
const express = require("express");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const knex = require("../../db/index");

const UserController = {
    // Get the user informmation for the profile page
    getUser: async (req, res) => {
      try {
        const { userid } = req.params;
        console.log(userid);
  
        if (userid === undefined) {
          res.status(500).json({ message: "User is undefined" });
          return;
        }
        //Send back all the information from our DB
        const data = await knex("users").select("*").where({ id: userid });
  
        if (data.length > 0) {
          res.status(200).json(data[0]);
          return;
        }
        res.status(404).json({ message: "user not found" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    },
    //Get information from frontend and check if user exists and send the user id, username and jwt-token back.
    login: async (req, res) => {
      try {
        const { email, password } = req.body;
        console.log(email, password);

        //Check if the email exists
        if (email === undefined) {
          res.status(500).json({ message: "email is not defined" });
          return;
        }
        
        const data = await knex
          .select("*")
          .from("users")
          .where({ email: email, password: password }); //Check if the user exists

        console.log(data);

        //If the user exists, create the token and send the information
        if (data.length > 0) {
          const token = jwt.sign(
            {
              firstName: data[0]["email"],
              lastName: data[0]["username"],
              userid: data[0]["id"],
            },
            process.env.JWT_SECRET || "my_secret",
            {
              expiresIn: "1h",
            }
          );
          //Send back the id, the username and the token to the frontend so they can store it and keep for authentification
          res.status(200).json({ token: token, username: data[0]["username"], userid: data[0]["id"] });
          return;
        }
        res.status(401).json({ error: "Validation Failed" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    },
    //Create new user in the DB and send the user id, username and jwt-token back. 
    signup: async (req, res) => {
      try {
        const { email, password, username } = req.body;
        console.log(email, password, username);
        const newUser = [
          {
            email: email,
            password: password,
            username: username,
          },
        ];
        const data = await knex("users").returning(["id", "username"]).insert(newUser);
        console.log(data);
  
        const token = jwt.sign(
          { email: email, username: username, userid: data[0]["id"] },
          process.env.JWT_SECRET || "my_secret",
          {
            expiresIn: "1h",
          }
        );
        res.status(201).json({ token: token, username: data[0]["username"], userid: data[0]["id"] });
        return;
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    },
    //Update user information
    putUser: async (req, res) => {
      try {
        const { userid } = req.params;
        const { email, password, username } = req.body;
        console.log(userid);
  
        if (userid === undefined) {
          res.status(500).json({ message: "user ID is undefined" });
          return;
        }
        const data = await knex("users")
          .where({ id: userid })
          .update({
            email: email,
            password: password,
            username: username,
          })
          .returning("*");
          
        // Send the updated information
        if (data.length > 0) {
          res.status(200).json(data[0]);
          return;
        }
        res.status(404).json({ message: "Not found" });
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    },
  };

  
module.exports = UserController;
