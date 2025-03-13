"use strict";
import { showLoginUser, showHomeUser } from "./messages.js";
import { LoginUser, CreateUser } from "./formUser.js";
import { MenuUser, MenuAdmin } from "./menu.js";
import { CreateTodo } from "./formTodo.js";
import { TodoList } from "./TodoList.js";

const bodyContent = document.getElementById("bodyContent");
const headContent = document.getElementById("headContent");
const footContent = document.getElementById("footContent");
let token = localStorage.getItem("token");

document.addEventListener("showCreateUser", (e) => {
  bodyContent.innerHTML = "";
  const createUser = new CreateUser();
  createUser.show(bodyContent);
});

document.addEventListener("showLoginUser", (e) => {
  bodyContent.innerHTML = "";
  const loginUser = new LoginUser();
  loginUser.show(bodyContent);
});

document.addEventListener("showHomeUser", (e) => {
  bodyContent.innerHTML ="";
  const todoList = new TodoList();
  todoList.show(bodyContent);
});

document.addEventListener("showCreateTodo", (e) => {
  bodyContent.innerHTML = "";
  const createTodo = new CreateTodo();
  createTodo.show(bodyContent);
});



if (!token) {
  document.dispatchEvent(showLoginUser);
} else {
  token = JSON.parse(token);
  if(token.role === "admin"){
    const menuAdmin = new MenuAdmin();
    menuAdmin.show(headContent);
  }else if(token.role === "user"){
    const menuUser = new MenuUser();
    menuUser.show(headContent);
    document.dispatchEvent(showHomeUser);
  }
  console.log(token);
  
}

