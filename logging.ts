import { readFile, readFileSync, writeFile } from "node:fs";
import { dirname } from "path";
import { mkdir } from "fs/promises";

export const LOG_PATH = "./logs/log.txt";

async function createFilePath(filePath: string) {
    try {
        await mkdir(dirname(filePath), { recursive: true });
    } catch (error) {
        console.error("Error creating directories:", error);
    }
}

export async function writeLog(contents: string) {
    createFilePath(LOG_PATH);
    readFile(LOG_PATH, { encoding: "utf-8" }, (err, data) => {
        if (err) {
            console.log("Erorr writing log: Failed to read log file");
            console.log("Error: ", err);
            return;
        } else {
            const updatedLog = data.concat(contents, "\n");
            writeFile(LOG_PATH, updatedLog, (err?) => {
                if (err) {
                    console.log("Error writing log: Write operation failed");
                    console.log("Error: ", err);
                    return;
                }
            });
        }
    });
}
