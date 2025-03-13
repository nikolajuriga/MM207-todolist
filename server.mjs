import dotenv from 'dotenv'
import express from 'express' // Express is installed using npm
import USER_API from './routes/usersRoute.mjs'; // This is where we have defined the API for working with users
import TODO_API from './routes/todoRoute.mjs';
import SuperLogger from './modules/SuperLogger.mjs';
import printDeveloperStartupImportantInformationMSG from "./modules/developerHelpers.mjs";
import AuthorizationManager from './modules/authorizationManager.mjs'; 

dotenv.config();

printDeveloperStartupImportantInformationMSG();


// Creating an instance of the server
const server = express();
// Selecting a port for the server to use.
const port = (process.env.PORT || 8080);
server.set('port', port);


// Enable logging for server
const logger = new SuperLogger();
server.use(logger.createAutoHTTPRequestLogger()); // Will logg all http method requests

server.use(express.static('public'));

const authManager = new AuthorizationManager();
server.use("/login", express.json());
server.use("/login", authManager.login);
server.use("/user", authManager.hasUserRole);
server.use("/user", USER_API);
server.use("/todo", TODO_API);


// Start the server 
server.listen(server.get('port'), function () {
    console.log('server running', server.get('port'));
});


