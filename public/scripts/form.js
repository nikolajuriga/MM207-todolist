"use strict";

export default class HTMLForm extends HTMLElement {
  constructor(formId, templateId) {
    if(new.target === HTMLForm) {
      throw new TypeError("Cannot construct HTMLForm instances directly");
    }
    super();
    this.formId = formId;
    this.templateId = templateId;
    this.form = null;
    this.attachShadow({ mode: "open" });
    this.#injectStyles();
    this.#loadTemplate();
  }

  #injectStyles() {
    const linkElement = document.createElement("link");
    linkElement.setAttribute("rel", "stylesheet");
    linkElement.setAttribute("href", "./styles/form.css");
    this.shadowRoot.appendChild(linkElement);
  }

  #loadTemplate() {
    const template = document.getElementById(this.templateId);
    const content = template.content.cloneNode(true);
    this.shadowRoot.appendChild(content);
    this.form = this.shadowRoot.getElementById(this.formId);
  }

  connectedCallback() {
    this.render();
  }

  validateForm() {
    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      return false;
    }
    return true;
  }

  render() {
    throw new Error("Method 'render()' must be implemented.");
  }
  
  show(parent = document.body) {
    parent.appendChild(this);
  }
}