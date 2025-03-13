
import DBManager from "./storageManager.mjs";
import bcrypt from 'bcrypt';


class User {
  #tableName = "User";
  #password;

  constructor({id, fullName, email, password, role}) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.#password = password;
    this.role = role;
    this.pwdHash = undefined;
  }

  async save() {
    const status = {
      isOk: this.email && this.fullName,
      data: null
    };
    if (!status.isOk) {
      status.data = "Missing required fields";
      return status;
    }
    if (!this.id && this.#password) {
      this.pwdHash = await bcrypt.hash(this.#password, 10);
      const result = await DBManager.crud(this.#tableName, "create", this);
      status.isOk = !result.code;
      if(status.isOk){
        status.data = result.rows[0];
        this.id = result.rows[0].id;
      }else{
        if (result.code === DBManager.DBCodes.UNIQUE_VIOLATION) {
          status.data = "User already exists";
        }else{
          status.data = result.message || "Error saving user";
        }
      }
    } else {
      return await DBManager.updateUser(this);
    }
    return status;
  }

  delete() {

    /// TODO: What happens if the DBManager fails to complete its task?
    DBManager.deleteUser(this);
  }

  async login() {
    const user = await DBManager.getUserByEmail(this.email);
    if (user) {
      this.id = user.id;
      this.role = user.role;
      const match = (this.#password && user.pwdHash) &&  await bcrypt.compare(this.#password, user.pwdHash);
      return match;
    }
    return false;
  }

  static async getAll() {
    const users = await DBManager.getAllUsers();
    return users;
  }

}

export default User;