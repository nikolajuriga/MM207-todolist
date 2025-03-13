import express from "express";
import User from "../modules/user.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const USER_API = express.Router();
USER_API.use(express.json()); // This makes it so that express parses all incoming payloads as JSON for this route.

let users = [];

USER_API.get("/", async (req, res, next) => {
    users = await User.getAll();
    res.status(HTTPCodes.SuccessfulRespons.Ok).json(users).end();
});

USER_API.get("/:id", (req, res, next) => {
  // Tip: All the information you need to get the id part of the request can be found in the documentation
  // https://expressjs.com/en/guide/routing.html (Route parameters)
  /// TODO:
  // Return user object
});

USER_API.post("/", async (req, res, next) => {
  try {
    const user = new User(req.body);
    const result = await user.save();
    if (result.isOk) {
      res.status(HTTPCodes.SuccessfulRespons.Ok).json(result.data).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send(result.data).end();
    }
  } catch (e) {
    SuperLogger.log(e, SuperLogger.LOGGING_LEVELS.CRITICAL);
    res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error, saving user").end();
  }
});

USER_API.post("/:id", async (req, res, next) => {
  /// TODO: Edit user
  const user = new User(); //TODO: The user info comes as part of the request
  user.save();
});

USER_API.delete("/:id", (req, res) => {
  /// TODO: Delete user.
  const user = new User(); //TODO: Actual user
  user.delete();
});


export default USER_API;
