import express from "express";
import Todo from "../modules/todo.mjs";
import { HTTPCodes } from "../modules/httpConstants.mjs";
import SuperLogger from "../modules/SuperLogger.mjs";

const TODO_API = express.Router();
TODO_API.use(express.json());

TODO_API.post("/", async (req, res, next) => {
    try {
      const todo = new Todo(req.body);
      const result = await todo.create();
      if (result.isOk) {
        res.status(HTTPCodes.SuccessfulRespons.Ok).json(result.data).end();
      } else {
        res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send(result.data).end();
      }
    } catch (e) {
      SuperLogger.log(e, SuperLogger.LOGGING_LEVELS.CRITICAL);
      res.status(HTTPCodes.ServerErrorRespons.InternalError).send("Internal Server Error, saving todo").end();
    }
  });

  //her legger eg inn for get og put od delete!!!!

  TODO_API.get("/", async (req, res, next) => {
    const todos = await Todo.getAll();
    res.status(HTTPCodes.SuccessfulRespons.Ok).json(todos).end();
  });

  TODO_API.put("/:id", async (req, res, next) => {
    const todo = new Todo(req.body);
    const result = await todo.update();
    if (result.isOk) {
      res.status(HTTPCodes.SuccessfulRespons.Ok).json(result.data).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send(result.data).end();
    }
  });

  TODO_API.delete("/:id", async (req, res, next) => {
    const todo = new Todo({id: req.params.id});
    const result = await todo.delete();
    if (result.isOk) {
      res.status(HTTPCodes.SuccessfulRespons.Ok).json(result.data).end();
    } else {
      res.status(HTTPCodes.ClientSideErrorRespons.BadRequest).send(result.data).end();
    }
  });




  export default TODO_API;