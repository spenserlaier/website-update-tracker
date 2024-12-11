import { chromium, devices } from "playwright";
import fs from "fs";
import readline from "readline";
import { exit } from "process";
import { parse } from "path";
const DEFAULT_CONFIGURATION = {
    websites: [],
};
const MINUTE_IN_SECONDS = 60;
const HOUR_IN_SECONDS = MINUTE_IN_SECONDS * 60;
const DAY_IN_SECONDS = HOUR_IN_SECONDS * 24;
const DEFAULT_INTERVAL = "0d0h5m0s";
function parseConfiguration() {
    fs.readFile("./config.json", { encoding: "utf-8" }, (err, data) => {
        if (!err && data) {
            let configuration;
            try {
                configuration = JSON.parse(data);
                return configuration;
            } catch (e) {
                console.log("Error when parsing configuration file: ", e);
                console.log("Exiting...");
                exit(e.errno);
            }
        }
    });
}

function addConfigWebsite(url) {
    fs.readFile("./config.json", { encoding: "utf-8" }, (err, data) => {
        if (!err && data) {
            let configuration;
            try {
                configuration = JSON.parse(data);
            } catch (e) {
                console.log("Error when parsing configuration file: ", e);
                console.log("Exiting...");
                exit(e.errno);
            }
            console.log("Found existing config: ", configuration);
            if (!configuration.websites.includes(url)) {
                configuration.websites.push(url);
                console.log("Writing website to configuration...");
                fs.writeFile(
                    "./config.json",
                    JSON.stringify(configuration),
                    function (err) {
                        if (err !== null) {
                            console.log("Error writing file: ", err);
                            exit(err.errno);
                        }
                    },
                );
                console.log("Write successful.");
            } else {
                console.log(
                    "URL already present in configuration file. Nothing to do",
                );
            }
        } else {
            if (err.errno === -2) {
                const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                });
                rl.question(
                    "No configuration file present. Initialize one? (y/n)",
                    function (answer) {
                        if (answer === "y") {
                            fs.writeFile(
                                "./config.json",
                                JSON.stringify(DEFAULT_CONFIGURATION),
                                function (err) {
                                    if (err !== null) {
                                        console.log(
                                            "Error writing file: ",
                                            err,
                                        );
                                        exit(err.errno);
                                    }
                                },
                            );
                            addConfigWebsite(url);
                        } else {
                            console.log(
                                "Program can't run without a config file. Exiting...",
                            );
                            exit(0);
                        }
                    },
                );
            }
        }
    });
}
addConfigWebsite("www.example.com");
function checkSite(xpath = "") {}

//(async () => {
//  // Setup
//  const browser = await chromium.launch();
//  const context = await browser.newContext(devices['iPhone 11']);
//  const page = await context.newPage();
//  // The actual interesting bit
//  await context.route('**.jpg', route => route.abort());
//  await page.goto('https://example.com/');
//
//  assert(await page.title() === 'Example Domain'); // 👎 not a Web First assertion
//
//  // Teardown
//  await context.close();
//  await browser.close();
//})();
