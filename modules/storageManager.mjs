import pg from "pg";
import SuperLogger from "./SuperLogger.mjs";
import dotenv from 'dotenv'
dotenv.config();

/// TODO: is the structure / design of the DBManager as good as it could be?

class DBManager {
  #credentials = {};
  static DBCodes = {
    UNIQUE_VIOLATION: "23505",
    FOREIGN_KEY_VIOLATION: "235",
    CHECK_VIOLATION: "23514",
    NOT_NULL_VIOLATION: "23502",
    INVALID_TEXT_REPRESENTATION: "22P02",
  };

  constructor(connectionString) {
    this.#credentials = {
      connectionString,
      ssl: process.env.DB_SSL === "true" ? process.env.DB_SSL : false,
    };
    this.DBCodes = DBManager.DBCodes;
  }

  async crud(tableName, type, data) {
    switch (type) {
      case "create":
        return await this.create(tableName, data);
      case "read":
        return await this.read(tableName, data);
      case "update":
        return await this.update(tableName, data);
      case "delete":
        return await this.delete(tableName, data);
    }
  }

  async create(tableName, data) {
    const client = new pg.Client(this.#credentials);
    let result;
    try {
      await client.connect();
      let query = `INSERT INTO "public"."${tableName}"(`;
      let values = "VALUES(";
      let params = [];
      let i = 1;
      for (const key in data) {
        // Don't include undefined values
        if (data[key] == undefined) {
          continue;
        }
        query += `"${key}", `;
        values += `$${i}, `;
        params.push(data[key]);
        i++;
      }
      query = query.slice(0, -2) + ") "; 
      values = values.slice(0, -2) + ") "; 
      query += values + "RETURNING id;";
      result = await client.query(query, params);
    } catch (error) {
      result = error;
    } finally {
      client.end();
    }

    return result;
  }

  async update(tableName, data) {
    const client = new pg.Client(this.#credentials);
    let result;
    try {
      await client.connect();
      let query = `UPDATE "public"."${tableName}" SET `;
      let conditions = [];
      let params = [];
      let i = 1;
      for (const key in data) {
        // Don't include undefined values and the id
        if (data[key] !== undefined && key !== "id") {
          conditions.push(`"${key}" = $${i}`);
          params.push(data[key]);
          i++;
        }
      }
      query += conditions.join(", ") + ` WHERE id = $${i} RETURNING id;`;
      params.push(data.id);
      result = await client.query(query, params);
    } catch (error) {
      result = error;
    } finally {
      client.end();
    }
    return result;
  }

  
  async delete(tableName, data) {
    const client = new pg.Client(this.#credentials);
    let result;
  
    try {
      await client.connect();
  
      // Sjekk at minst ett kriterium er oppgitt
      if (!data || Object.keys(data).length === 0) {
        throw new Error("At least one condition is required for deletion.");
      }
  
      // Bygg WHERE-klausulen dynamisk
      let query = `DELETE FROM "public"."${tableName}" WHERE `;
      let conditions = [];
      let params = [];
      let i = 1;
  
      for (const key in data) {
        if (data[key] !== undefined) {
          conditions.push(`"${key}" = $${i}`);
          params.push(data[key]);
          i++;
        }
      }
  
      query += conditions.join(" AND ") + " RETURNING id;";
  
      // Utfør DELETE-query
      result = await client.query(query, params);
  
    } catch (error) {
      result = error;
    } finally {
      await client.end();
    }
  
    return result;
  }
  

  

  async updateUser(user) {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query('Update "public"."Users" set "name" = $1, "email" = $2, "password" = $3 where id = $4;', [user.name, user.email, user.pswHash, user.id]);

      // Client.Query returns an object of type pg.Result (https://node-postgres.com/apis/result)
      // Of special interest is the rows and rowCount properties of this object.

      //TODO Did we update the user?
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module separate from your server
    } finally {
      client.end(); // Always disconnect from the database.
    }

    return user;
  }


  async getAllUsers() {
    const client = new pg.Client(this.#credentials);
    let output;
    try {
      await client.connect();
      output = await client.query('SELECT * FROM public."User"');
      output = output.rows;
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module separate from your server
      console.log(error);
    } finally {
      client.end();
    }
    return output;
  }

  async getUserByEmail(email) {
    const client = new pg.Client(this.#credentials);
    let output;
    try {
      await client.connect();
      output = await client.query('SELECT * FROM public."User" WHERE email = $1', [email]);
      output = output.rows[0];
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module separate from your server
      console.log(error);
      output = error;
    } finally {
      client.end();
    }
    return output;
  }

  async getAllTodos() {
    const client = new pg.Client(this.#credentials);
    let output;
    try {
      await client.connect();
      //Order by startDateTime in descending order and the ID in ascending order
      output = await client.query('SELECT * FROM public."Todo" ORDER BY "startDateTime" DESC, id ASC');
      output = output.rows;
    } catch (error) {
      //TODO : Error handling?? Remember that this is a module separate from your server
      console.log(error);
      output = error;
      output.code = DBManager.DBCodes.INVALID_TEXT_REPRESENTATION;

    } finally {
      client.end();
    }
    return output;
  }

  async testConnection() {
    const client = new pg.Client(this.#credentials);

    try {
      await client.connect();
      const output = await client.query("SELECT 1 AS column1");
      if (output.rows[0].column1 != 1) {
        SuperLogger.log("Database connection failed", SuperLogger.LOGGING_LEVELS.CRITICAL);
      }
    } catch (error) {
      console.error(error);
    } finally {
      client.end();
    }
  }
}

// The following is three examples of how to get the db connection string from the environment variables.
// They accomplish the same thing but in different ways.
// It is a judgment call which one is the best. But go for the one you understand the best.

// 1:
let connectionString = process.env.ENVIRONMENT == "local" ? process.env.DB_CONNECTION_STRING_LOCAL : process.env.DB_CONNECTION_STRING_PROD;

// 2:
connectionString = process.env.DB_CONNECTION_STRING_LOCAL;
if (process.env.ENVIRONMENT != "local") {
  connectionString = process.env.DB_CONNECTION_STRING_PROD;
}

//3:
connectionString = process.env["DB_CONNECTION_STRING_" + process.env.ENVIRONMENT.toUpperCase()];

// We are using an environment variable to get the db credentials
if (connectionString == undefined) {
  throw "You forgot the db connection string";
}

export default new DBManager(connectionString);

//
