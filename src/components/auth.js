import jwt from "jsonwebtoken";

class Auth {
  constructor() {
    this.authenticated = false;
  }

  userIsAuthenticated() {
    const localToken = localStorage.getItem("token");
    return jwt.verify(localToken, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return;
      }

      if (result) {
        return (this.authenticated = true);
      }
    });
  }

  deAuthenticateUser() {
    localStorage.clear();
    return (this.authenticated = false);
  }

  userIsAdmin() {
    const token = localStorage.getItem("token");
    return jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return;
      }
      if (result) {
        return result.user.admin;
      }
    });
  }

  decodeToken() {
    const token = localStorage.getItem("token");
    return jwt.verify(token, process.env.JWT_SECRET, (err, result) => {
      if (err) {
        return;
      }

      if (result) {
        return result;
      }
    });
  }
}

export default new Auth();
