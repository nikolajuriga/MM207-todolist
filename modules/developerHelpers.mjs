import SuperLogger from "./SuperLogger.mjs";
import chalk from "chalk";

export default function printDeveloperStartupImportantInformationMSG() {

    drawLine("#", 20);

    SuperLogger.log(`Server environment ${process.env.ENVIRONMENT}`, SuperLogger.LOGGING_LEVELS.CRITICAL);

    if (process.env.ENVIRONMENT == "local") {
        SuperLogger.log(`Database connection  ${process.env.DB_CONNECTION_STRING_LOCAL}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
    } else {
        SuperLogger.log(`Database connection  ${process.env.DB_CONNECTION_STRING_LOCAL}`, SuperLogger.LOGGING_LEVELS.CRITICAL);
    }

    if (process.argv.length > 2) {
        if (process.argv[2] == "--setup") {
            SuperLogger.log(chalk.red("Runing setup for database"), SuperLogger.LOGGING_LEVELS.CRITICAL);
            // TODO: Code that would set up our database with tables etc..
            // I have done this with the files in the sql folder.
            // And with the postgres extension for VSCode.
        }
    }

    drawLine("#", 20);

}

function drawLine(symbol, length) {
    SuperLogger.log(symbol.repeat(length), SuperLogger.LOGGING_LEVELS.CRITICAL);
}