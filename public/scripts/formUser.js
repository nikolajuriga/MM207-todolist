import HTMLForm from "./form.js";
import { apiServer } from "./server.js";
import {showCreateUser, showLoginUser, showHomeUser} from "./messages.js";
import {ModalError} from "./modal.js";

export class CreateUser extends HTMLForm {
  #buttonCreateUser;
  #buttonLoginUser;


  constructor() {
    super("createUserForm", "new-user-template");
  }

  render(){
    this.#buttonCreateUser = this.shadowRoot.getElementById("buttonCreateUser");
    this.#buttonCreateUser.addEventListener("click", async (event) => {
      //Prevent the default form submission
      event.preventDefault();
      if(!this.validateForm()){
        return;
      }
      //Fetch the form data
      await apiServer.fetchForm(this.form);
      if(apiServer.ok){
        document.dispatchEvent(showLoginUser);
      }else{
        const modalError = new ModalError();
        modalError.message = apiServer.data;
        modalError.show(); // instead of appendChild
      }
    });

    this.#buttonLoginUser = this.shadowRoot.getElementById("buttonLoginUser");
    this.#buttonLoginUser.addEventListener("click", (event) => {
      //Prevent the default form submission
      event.preventDefault();
      document.dispatchEvent(showLoginUser);
    });
  }

  disconnectedCallback() {
    this.#buttonCreateUser.removeEventListener("click", this.#buttonCreateUser);
    this.#buttonLoginUser.removeEventListener("click", this.#buttonLoginUser);
  }
}

export class LoginUser extends HTMLForm {
  #buttonLoginUser;
  #buttonCreateUser;
  constructor() {
    super("loginUserForm", "login-user-template");
  }

  render(){
    this.#buttonLoginUser = this.shadowRoot.getElementById("buttonLoginUser");
    this.#buttonLoginUser.addEventListener("click", async (event) =>{
      //Prevent the default form submission
      event.preventDefault();

      //validate the form
      if(!this.validateForm()){
        return;
      }
      //Fetch the form data
      await apiServer.fetchForm(this.form);
      if(apiServer.ok){
        //Store the token in local storage
        localStorage.setItem("token", JSON.stringify(apiServer.data));
        document.dispatchEvent(showHomeUser);
      }else{
        const modalError = new ModalError();
        modalError.message = "Incorrect username or password";
        modalError.show(); // instead of appendChild
      }

    });

    this.#buttonCreateUser = this.shadowRoot.getElementById("buttonCreateUser");
    this.#buttonCreateUser.addEventListener("click", (event) => {
      //Prevent the default form submission
      event.preventDefault();
      document.dispatchEvent(showCreateUser);
    });
  }

  disconnectedCallback() {
    this.#buttonLoginUser.removeEventListener("click", this.#buttonLoginUser);
    this.#buttonCreateUser.removeEventListener("click", this.#buttonCreateUser);
  }
}


customElements.define("create-user", CreateUser);
customElements.define("login-user", LoginUser);