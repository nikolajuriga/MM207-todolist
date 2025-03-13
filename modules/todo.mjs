import DBManager from "./storageManager.mjs";


class Todo {
    #tableName = "Todo";
    constructor({ id, title, description, status = 'pending', startDateTime, endDateTime = null }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.startDateTime = new Date(startDateTime);
        this.endDateTime = endDateTime ? new Date(endDateTime) : null;
    }
    async create() {
        const status = {
            isOk: (!this.title || !this.description || !this.startDateTime) === false,
            data: null
        };
        if (status.isOk) {
            this.id = undefined; //id skal ikkje vere med når eg laga en ny record
            const result = await DBManager.crud(this.#tableName, "create", this);
            status.isOk = !result.code;
            if(status.isOk){
                status.data = result.rows[0];
                this.id = status.data.id;
                return status;
            }else{
                status.data = result.message || "Error saving Todo";
            }
        }else{
            status.data = "Missing required fields";
        }
    }

    async delete(){
        const status = {
            isOk: (!this.id) === false,
            data: null
        };
        if (status.isOk) {
            this.title = undefined;
            this.description = undefined;
            this.status = undefined;
            this.startDateTime = undefined;
            this.endDateTime = undefined

            const result = await DBManager.crud(this.#tableName, "delete", this);
            status.isOk = !result.code;
            if(status.isOk){
                status.data = result.rows[0];
                this.id = status.data.id;
                return status;
            }else{
                status.data = result.message || "Error deleting Todo";
            }
        }else{
            status.data = "Missing required fields";
        }
        return status;
    }

    async update(){
        const status = {
            isOk: (!this.id || !this.title || !this.description || !this.startDateTime) === false,
            data: null
        };
        if (status.isOk) {
            const result = await DBManager.crud(this.#tableName, "update", this);
            status.isOk = !result.code;
            if(status.isOk){
                status.data = result.rows[0];
                this.id = status.data.id;
                return status;
            }else{
                status.data = result.message || "Error updating Todo";
            }
        }else{
            status.data = "Missing required fields";
        }
        return status;
    }

    static async getAll() {
        const status = {
            isOk: false,
            data: null
        };
        const result = await DBManager.getAllTodos();
        status.isOk = !result.code;
        if(status.isOk){
            status.data = result;
        }else{
            status.data = result.message || "Error getting Todo";
        }
        return status.data;
    }
}

export default Todo;
