"use strict";
import User from "./user.mjs";
import { HTTPCodes } from "./httpConstants.mjs";

export default class AuthorizationManager {
  constructor() {
  }

  login = async(req, res) => {
    if(!req.body){
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send("Missing body").end();
      return;
    }
    const user = new User(req.body);
    if (await user.login()) {
      const token = this.createToken(user);
      res.status(HTTPCodes.SuccessfulRespons.Ok).send(token).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorRespons.Unauthorized).send("Login failed").end();
    }
  }

  hasUserRole = (req, res, next) => {
    let token = this.getToken(req);
    if (!token) {
      if(req.method === "POST" && req.path === "/"){
        //Allow creating a user without a token
        next();
        return;
      }
      res.status(401).send("Unauthorized");
      return;
    }
    token = JSON.parse(token);
    if (token.role === "user" || token.role === "admin") {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  }

  hasAdminRole = (req, res, next) => {
    const token = this.getToken(req); 
    if (!token) {
      res.status(401).send("Unauthorized");
      return;
    }
    token = JSON.parse(token);
    if (token.role === "admin") {
      next();
    } else {
      res.status(403).send("Forbidden");
    }
  }

  getToken(req) {
    let token = req.headers.authorization;
    if (!token) {
      return null;
    }
    //TODO: Decrypt the token
    token = JSON.parse(token);
    //Check if the token is expired (1 hour)
    if (token.exp < Date.now()) {
      return null;
    }
    return token;
  }

  createToken(user){
    //TODO add cryptographically secure the token
    return JSON.stringify({ID: user.ID, role: user.role, exp: Date.now() + 1000 * 60 * 60}); //1 hour
  }

}