import { runProgram, trackWebsite } from "./index.js";

const args = process.argv;
const valid_arguments = {
    "add-website":
        "adds a website to the chosen config usage: 'node cli.js --add-website <url>'",
    "remove-website":
        "removes a website from the chosen config usage: 'node cli.js --remove-website <url>'",
};

if (args.length === 0) {
    runProgram();
} else {
    //TODO: parse command line arguments
}
