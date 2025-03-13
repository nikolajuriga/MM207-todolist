import { apiServer } from "./server.js";
import { showCreateTodo } from "./messages.js";
import { ModalError } from "./modal.js";
import { CreateTodo } from "./formTodo.js";

export class TodoList extends HTMLElement {
  #tableBody;
  #templateToDoListItem;
  #buttonNewTodo;  
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#injectStyles();
    this.#loadTemplate();
  }


  #buttonNewTodoClick(){
    document.dispatchEvent(showCreateTodo);
  }

  #injectStyles() {
    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", "./styles/todo-list.css");
    this.shadowRoot.appendChild(linkElement);
  }

  #loadTemplate() {
    let template = document.getElementById("todo-list-template");
    if (template) {
      const content = template.content.cloneNode(true);
      this.shadowRoot.appendChild(content);
      this.#tableBody = this.shadowRoot.querySelector("tbody");
      template = document.getElementById("todo-list-item-template");
      this.#buttonNewTodo = this.shadowRoot.getElementById("buttonNewTodo"); 
      this.#buttonNewTodo.addEventListener("click", this.#buttonNewTodoClick);
      if (template) {
        this.#templateToDoListItem = template.content;
      } else {
        console.error("Todo list item template not found!");
      }
    } else {
      console.error("Todo list template not found!");
    }
  }


  connectedCallback() {
    this.#fetchTodos();

  }

  async #fetchTodos() {
    try {
      //Clear the table
      this.#tableBody.innerHTML = "";
      await apiServer.fetchData("/todo")
      if (!apiServer.ok) throw new Error("Failed to fetch todos");
      const todos = apiServer.data;
      this.#renderTodos(todos);
    } catch (error) {
      console.error("Error fetching todos:", error);
      const modal = new ModalError();
      modal.message = error;
      modal.show();
    }
  }

  async #deleteTodo(todo) {
    try {
      await apiServer.fetchData(`/todo/${todo.id}`, "DELETE");
      if (!apiServer.ok) throw new Error("Failed to delete todo");
      this.#fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error); 
      const modal = new ModalError();
      modal.message = error;
      modal.show();
    }
  }

  async #editTodo(todo){
    console.log("Edit todo" + todo.id);
    const  bodyContent = document.getElementById("bodyContent");
    bodyContent.innerHTML = "";
    const modal = new CreateTodo(todo);
    modal.data = todo;
    modal.show(bodyContent);
  }

  #renderTodos(todos) {
    this.#tableBody.innerHTML = ""; // Tøm tidligere liste

    todos.forEach(todo =>{
      const row = this.#templateToDoListItem.cloneNode(true);

      // Sett status styling
      let statusClass = "status-pending";
      if (todo.status === "completed") statusClass = "status-completed";
      if (todo.status === "cancelled") statusClass = "status-cancelled";
      //Vi må løpe igjennom alle td elementene i row for å sette inn verdier
      const allTds = row.querySelectorAll("td");
      allTds[0].textContent = todo.id;
      allTds[1].textContent = todo.title;
      allTds[2].textContent = todo.description;
      allTds[3].textContent = new Date(todo.startDateTime).toLocaleString();
      allTds[4].textContent = todo.endDateTime ? new Date(todo.endDateTime).toLocaleString() : "No end date";
      allTds[5].textContent = todo.status;
      allTds[5].classList.add(statusClass);
      let img = document.createElement("img");
      img.src = "./media/close-icon.png";
      img.alt="delete";
      img.classList.add("tool-box-del");
      img.addEventListener("click", () =>{
        this.#deleteTodo(todo);
      });
      allTds[6].appendChild(img);
      img = document.createElement("img");
      img.src = "./media/edit.png";
      img.alt="delete";
      img.classList.add("tool-box-del");
      img.addEventListener("click", () =>{
        this.#editTodo(todo);
      });
      allTds[6].appendChild(img);

      this.#tableBody.appendChild(row);
    });
    const todoCount = this.shadowRoot.getElementById("todoCount");
    todoCount.textContent = todos.length;
  }


  show(parent = document.body) {
    parent.appendChild(this);
  }
}

customElements.define("todo-list", TodoList);
