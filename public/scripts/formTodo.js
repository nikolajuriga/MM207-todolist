import HTMLForm from "./form.js";
import { apiServer } from "./server.js";
import { showHomeUser } from "./messages.js";
import { ModalError } from "./modal.js";

export class CreateTodo extends HTMLForm {
  #buttonCreateTodo;
  #startDateTimeInput;
  #endDateTimeInput;
  #isCreateForm;
  #data;

  constructor(data = null) {
    super("createTodoForm", "new-todo-template");
    this.#isCreateForm = data === null;
    this.#data = data;
  }
  
  #setDefaultDates() {
    // Hent dagens dato og klokkeslett i riktig format (YYYY-MM-DDTHH:MM)
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 10); // Legg til 10 dager

    // Formater datoene til riktig `datetime-local` format
    const formatDateTime = (date) => {
      return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    };

    this.#startDateTimeInput.value = formatDateTime(now);
    this.#endDateTimeInput.value = formatDateTime(futureDate);
  }

  #loadData() {
    if (this.#data) {
      //Id is hidden in the form, and id is the html element id
      this.form.querySelector("input[name='id']").value = this.#data.id;
      this.form.title.value = this.#data.title;
      this.form.description.value = this.#data.description;
    // Format the date strings to match the `datetime-local` input format
    const formatDateTime = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16); // YYYY-MM-DDTHH:MM
    };

    this.form.startDateTime.value = formatDateTime(this.#data.startDateTime);
    this.form.endDateTime.value = formatDateTime(this.#data.endDateTime);
    }
  }

  #buttonCreateTodoClick = async (event) => {
      // Prevent the default form submission
      event.preventDefault();

      // Validate form before sending
      if (!this.validateForm()) {
        return;
      }

      // Fetch the form data and send to the API
      // change action and method based on the form type
      const methodInput = this.shadowRoot.querySelector("input[name='_method']");
      if(this.#isCreateForm){
        this.form.action = "/todo";
        this.form.method = "post";
        methodInput.value = "POST";
      } else {
        this.form.action = `/todo/${this.#data.id}`;
        this.form.method = "post"; // Use POST method for the form
        methodInput.value = "PUT"; // Simulate PUT method
      }

      await apiServer.fetchForm(this.form);

      if (apiServer.ok) {
        document.dispatchEvent(showHomeUser); // Show the main Todo list view
      } else {
        // Show error modal
        const modalError = new ModalError();
        modalError.message = apiServer.data;
        modalError.show();
      }
  }

  render() {
    this.#startDateTimeInput = this.shadowRoot.querySelector("[name='startDateTime']");
    this.#endDateTimeInput = this.shadowRoot.querySelector("[name='endDateTime']");
    this.#buttonCreateTodo = this.shadowRoot.getElementById("buttonCreateTodo");

    if (!this.#isCreateForm) {
      this.#buttonCreateTodo.textContent = "Update Todo";
      this.#loadData();
    }else{
      this.#buttonCreateTodo.textContent = "Create Todo";
      this.#setDefaultDates();
    }

    this.#buttonCreateTodo.addEventListener("click", this.#buttonCreateTodoClick); 
  }

  disconnectedCallback() {
    this.#buttonCreateTodo.removeEventListener("click", this.#buttonCreateTodoClick);
  }
}

customElements.define("create-todo", CreateTodo);