"use strict";

class ModalComponent extends HTMLElement {
  constructor(styleFile, modalTemplate) {
    if (new.target === ModalComponent) {
      throw new TypeError("Cannot construct ModalComponent instances directly");
    }
    super();
    this.styleFile = styleFile;
    this.modalTemplate = modalTemplate;
    this.attachShadow({ mode: "open" });
    const template = document.getElementById(this.modalTemplate);
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);
  }

  #injectStyles() {
    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", this.styleFile);
    this.shadowRoot.appendChild(linkElement);
  }

  connectedCallback() {
    this.#injectStyles();
    this.render();
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector(".close-button").removeEventListener("click", this.close);
  }

  render() {
    this.shadowRoot.querySelector(".close-button").addEventListener("click", () => {
      this.remove();
      //Delete all ""modal-error" elements
      const modalErrors = document.querySelectorAll("modal-error");
      modalErrors.forEach((modal) => {
        modal.remove();
      });
    });
  }

  get message() {
    return this.shadowRoot.getElementById("error-message").textContent;
  }

  set message(msg) {
    const paragraph = this.shadowRoot.getElementById("error-message");
    paragraph.textContent = msg;
  }

  show(parent = document.body) {
    parent.appendChild(this);
  }
}

export class ModalError extends ModalComponent {
  constructor(message) {
    super("./styles/modalError.css", "modal-error-template", message);
  }
}

customElements.define("modal-error", ModalError);
