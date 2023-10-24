"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileManager = void 0;
var fs = require("node:fs");
var rs = require("readline-sync");
//Clase Utilitaria
var FileManager = /** @class */ (function () {
    function FileManager() {
    }
    FileManager.readUsers = function () {
        try {
            var users = fs.readFileSync("./users.json", { encoding: "utf-8" });
            console.log("Lectura de datos satisfactoria FileManager.readUsers");
            rs.keyInPause("\n");
            return JSON.parse(users);
        }
        catch (err) {
            console.log("Unexpected Error:", err);
        }
        rs.keyInPause("\n");
    };
    FileManager.appendUsers = function (data) {
        try {
            fs.writeFileSync("./users.json", JSON.stringify(data, null, 2), {
                encoding: "utf8",
            });
        }
        catch (err) {
            console.log("Unexpected Error:", err);
            rs.keyInPause("\n");
        }
    };
    FileManager.readLoans = function () {
        try {
            var loans = fs.readFileSync("./loans.json", { encoding: "utf-8" });
            console.log("Lectura de datos satisfactoria FileManager.readLoans");
            rs.keyInPause("\n");
            return JSON.parse(loans);
        }
        catch (err) {
            console.log("Unexpected Error:", err);
        }
        rs.keyInPause("\n");
    };
    FileManager.appendLoan = function (data) {
        try {
            fs.writeFileSync("./loans.json", JSON.stringify(data, null, 2), {
                encoding: "utf8",
            });
        }
        catch (err) {
            console.log("Unexpected Error:", err);
            rs.keyInPause("\n");
        }
    };
    FileManager.readLibraryItems = function () {
        try {
            var libraryItems = fs.readFileSync("./libraryItems.json", { encoding: "utf-8" });
            return JSON.parse(libraryItems);
        }
        catch (err) {
            console.log("Unexpected Error:", err);
        }
        rs.keyInPause("\n");
    };
    FileManager.appendLibraryItem = function (data) {
        try {
            fs.writeFileSync("./libraryItems.json", JSON.stringify(data, null, 2), {
                encoding: "utf8",
            });
        }
        catch (err) {
            console.log("Unexpected Error:", err);
            rs.keyInPause("\n");
        }
    };
    return FileManager;
}());
exports.FileManager = FileManager;
