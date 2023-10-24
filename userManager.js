"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
var user_1 = require("./user");
var fileManager_1 = require("./fileManager");
var rs = require("readline-sync");
var UserManager = /** @class */ (function () {
    function UserManager() {
        this.menuOptionsUsersMemoria = ["List Users", "Create Users", "Update Users", "Delete Users"];
        this.menuOptionsUsersArchivos = ["List Users", "Create Users", "Update Users", "Delete Users"];
        this.users = [];
    }
    UserManager.prototype.readUsersMemoria = function () {
        console.log("========= Users =========\n");
        if (!this.users.length) {
            console.log("Arreglo vacío, No Users found. \n");
        }
        else {
            console.log("Cantidad de Users", this.users.length);
            this.users.forEach(function (user) { return console.log(user); });
        }
        rs.keyInPause("\n");
    };
    UserManager.prototype.createUserMemoria = function () {
        console.log("========= Create User =========");
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        var newUser = new user_1.User(name, { street: street, number: number, apartment: apartment }, phoneNumber);
        this.users.push(newUser);
        console.log(this.users);
        rs.keyInPause();
    };
    UserManager.prototype.updateUserMemoria = function () {
        console.log("========= Update User =========");
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.users.findIndex(function (user) { return user.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.users[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getName, " ?"));
            if (confirmation) {
                // this.createUser();
            }
            else {
                console.log(" Update Cancelled. User not Updated. \n");
            }
        }
        else {
            console.log("User not found.\n");
        }
        rs.keyInPause();
    };
    UserManager.prototype.deleteUserMemoria = function () {
        console.log("======== Delete User ========\n");
        var idToDelete = rs.question("Enter the Id of the User to delete: ");
        var recordIndex = this.users.findIndex(function (user) { return user.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el User con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.users[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getName(), " ? (Y/N)"));
            if (confirmation) {
                this.users.splice(recordIndex, 1);
            }
            else {
                console.log("Deletion canceled. User not removed. \n");
            }
        }
        else {
            console.log("User not found.\n");
        }
        rs.keyInPause();
    };
    UserManager.prototype.readUsersArchivos = function () {
        var readResult = fileManager_1.FileManager.readUsers();
        if (readResult) {
            this.users = readResult;
            console.log("========= Users =========\n");
            if (!this.users.length) {
                console.log("Arreglo vacío, No Users found. \n");
            }
            else {
                console.log("Cantidad de Users", this.users.length);
                this.users.forEach(function (user) { return console.log(user); });
            }
        }
        rs.keyInPause("\n");
    };
    UserManager.prototype.createUserArchivos = function () {
        console.log("========= Create User =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readUsers();
        if (readResult) {
            this.users = readResult;
        }
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        var newUser = new user_1.User(name, { street: street, number: number, apartment: apartment }, phoneNumber);
        this.users.push(newUser);
        fileManager_1.FileManager.appendUsers(this.users);
        console.log(this.users);
        rs.keyInPause();
    };
    UserManager.prototype.updateUserArchivos = function () {
        console.log("========= Update User =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readUsers();
        if (readResult) {
            this.users = readResult;
        }
        console.log(readResult);
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.users.findIndex(function (user) { return user.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.users[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getName, " ?"));
            if (confirmation) {
                // this.createUser();
            }
            else {
                console.log(" Update Cancelled. User not Updated. \n");
            }
        }
        else {
            console.log("User not found.\n");
        }
        rs.keyInPause();
    };
    UserManager.prototype.deleteUserArchivos = function () {
        console.log("======== Delete User ========\n");
        var readResult = fileManager_1.FileManager.readUsers();
        if (readResult) {
            this.users = readResult;
        }
        var idToDelete = rs.question("Enter the Id of the User to delete: ");
        var recordIndex = this.users.findIndex(function (user) { return user.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el User con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.users[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getName(), " ? (Y/N)"));
            if (confirmation) {
                this.users.splice(recordIndex, 1);
                fileManager_1.FileManager.appendUsers(this.users);
            }
            else {
                console.log("Deletion canceled. User not removed. \n");
            }
        }
        else {
            console.log("User not found.\n");
        }
        rs.keyInPause();
    };
    UserManager.prototype.menuUsersMemoria = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsUsersMemoria);
            switch (choice) {
                case 0:
                    this.readUsersMemoria();
                    break;
                case 1:
                    this.createUserMemoria();
                    break;
                case 2:
                    this.updateUserMemoria();
                    break;
                case 3:
                    this.deleteUserMemoria();
                    break;
                default:
                    console.log("\n        -------------\n        |           |\n        | GOOD BYE! | \n        |  SEE YOU  |\n        |   LATER   |\n        |           |\n        ------------- \n        ");
                    return;
            }
        }
    };
    UserManager.prototype.menuUsersArchivos = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsUsersArchivos);
            switch (choice) {
                case 0:
                    this.readUsersArchivos();
                    break;
                case 1:
                    this.createUserArchivos();
                    break;
                case 2:
                    this.updateUserArchivos();
                    break;
                case 3:
                    this.deleteUserArchivos();
                    break;
                default:
                    console.log("\n        -------------\n        |           |\n        | GOOD BYE! | \n        |  SEE YOU  |\n        |   LATER   |\n        |           |\n        ------------- \n        ");
                    return;
            }
        }
    };
    return UserManager;
}());
exports.UserManager = UserManager;
