"use strict";

export const ResponseCode = {
  Informal: {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
  },
  Success: {
    OK: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    Partial: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    IMUsed: 226,
  },
  Redirection: {
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
  },
  ClientError: {
    BadRequest: 400,
    Unauthorized: 401,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    Conflict: 409,
    Gone: 410,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    URITooLong: 414,
    UnsupportedMediaType: 415,
    UnprocessableEntity: 422,
    TooManyRequests: 429,
  },
  ServerError: {
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
  },
};

class APIServer {
  constructor() {
    this.status = ResponseCode.Success.OK;
    this.data = null;
  }

  async fetchForm(htmlForm) {
    const methodInput = htmlForm.querySelector("input[name='_method']");
    let formData = new FormData(htmlForm);
    const url = htmlForm.action;
    const method = methodInput && methodInput.value.toLowerCase() || htmlForm.method.toLowerCase();
    const headers = new Headers();
    let body = null;

    //If request is POST or PUT add headers
    if (method === "post" || method === "put") {
      const token = localStorage.getItem("token");
      if (token) {
        headers.append("Authorization", `Bearer ${token}`);
      }
      headers.append("Content-Type", "application/json");
      body = JSON.stringify(Object.fromEntries(formData.entries()));
    }
    try{
      const response = await fetch(url, {
        method: method,
        headers: headers,
        body: body,
      });
      this.status = response.status;
      if (response.ok) {
        this.status = response.status;
        this.data = await response.json();
      } else {
        this.data = await response.text();
        console.error(this.data);
      }
    }
    catch(err){
      this.status = ResponseCode.ServerError.ServiceUnavailable;
      this.data = err;
      console.error(err);
    }
  }

  async fetchData(endPoint, type = "GET") {
    const url = endPoint;
    const headers = new Headers();
    const token = localStorage.getItem("token");
    if (token) {
      headers.append("Authorization", `Bearer ${token}`);
    }
    try{
      const response = await fetch(url, {
        method: type,
        headers: headers,
      });
      this.status = response.status;
      if (response.ok) {
        this.status = response.status;
        this.data = await response.json();
      } else {
        this.data = await response.text();
        console.error(this.data);
      }
    }
    catch(err){
      this.status = ResponseCode.ServerError.ServiceUnavailable;
      this.data = err;
      console.error(err);
    }
  }

  get ok() {
    return this.status >= ResponseCode.Success.OK && this.status < ResponseCode.Redirection.MultipleChoices;
  }
}

export const apiServer = new APIServer();
