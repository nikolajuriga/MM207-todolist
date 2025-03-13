"use strict";

//import {  } from "./messages.js";

class Menu extends HTMLElement{
  constructor(templateId){
    super();
    this.attachShadow({mode: "open"});
    this.templateId = templateId;
    this.#injectStyles();
    this.#loadTemplate();
    this.buttonTodoList = this.shadowRoot.getElementById("buttonTodoList");
    this.buttonMyInfo = this.shadowRoot.getElementById("buttonMyInfo");
    this.buttonLogout = this.shadowRoot.getElementById("buttonLogout");
  }

  #injectStyles(){
    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", "./styles/menu.css");
    this.shadowRoot.appendChild(linkElement);
  }

  #loadTemplate(){
    const template = document.getElementById(this.templateId);
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);
  }

  connectedCallback(){
    this.buttonTodoList.addEventListener("click", (event) => {
      event.preventDefault();
      //document.dispatchEvent(showTodoList);
    });
    this.buttonMyInfo.addEventListener("click", (event) => {
      event.preventDefault();
      //document.dispatchEvent(showMyInfo);
    });
    this.buttonLogout.addEventListener("click", (event) => {
      event.preventDefault();
      localStorage.removeItem("token");
      location.reload();
    });
    this.render();
  }

  disconnectedCallback(){
    this.buttonTodoList.removeEventListener("click", this.buttonTodoList);
    this.buttonMyInfo.removeEventListener("click", this.buttonMyInfo);
    this.buttonLogout.removeEventListener("click", this.buttonLogout);
  }

  render(){
    throw new Error("Method 'render()' must be implemented.");
  }

  show(parent = document.body){
    parent.appendChild(this);
  }

}

export class MenuUser extends Menu{
  constructor(){
    super("menu-user-template");
  }

  render(){}
}

export class MenuAdmin extends Menu{
  constructor(){
    super("menu-admin-template");
    this.buttonUsers = this.shadowRoot.getElementById("buttonUsers");
  }

  disconnectedCallback(){
    super.disconnectedCallback();
    this.buttonUsers.removeEventListener("click", this.buttonUsers);
  }

  render(){
    this.buttonUsers.addEventListener("click", (event) => {
      event.preventDefault();
      document.dispatchEvent(showUsers);
    });
  }
}

customElements.define("menu-user", MenuUser);
customElements.define("menu-admin", MenuAdmin);