"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryItemsManager = void 0;
var libraryItem_1 = require("./libraryItem");
var rs = require("readline-sync");
var fileManager_1 = require("./fileManager");
var LibraryItemsManager = /** @class */ (function () {
    function LibraryItemsManager() {
        this.menuOptionsMemoria = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];
        this.menuOptionsArchivos = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];
        this.libraryItems = [];
    }
    LibraryItemsManager.prototype.readLibraryItemsMemoria = function () {
        if (this.libraryItems.length = 0) {
            console.log("Arreglo vacío, No LibraryItems found. \n");
        }
        else {
            console.log("========= Library Items =========\n");
            console.log("Cantidad de LibraryItems", this.libraryItems.length);
            this.libraryItems.forEach(function (libraryItem) { return console.log(libraryItem); });
        }
        rs.keyInPause("\n");
    };
    LibraryItemsManager.prototype.createLibraryItemMemoria = function () {
        console.log("========= Create LibraryItem =========");
        rs.keyInPause();
        var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
        var year = rs.questionInt("Enter the year: ");
        var newItem = new libraryItem_1.LibraryItem(title, year);
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        this.libraryItems.push(newItem);
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.updateLibraryItemMemoria = function () {
        console.log("========= Update LibraryItem =========");
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.libraryItems.findIndex(function (lItem) { return lItem.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.libraryItems[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getId, " ?"));
            if (confirmation) {
                var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
                recordToUpdate.setTitle(title);
                var year = rs.questionInt("Enter the year: ");
                recordToUpdate.setYear(year);
                var newItem = new libraryItem_1.LibraryItem(title, year);
                var name_1 = rs.question("Ingrese el Nombre del Usuario: ");
                var street = rs.question("Ingrese Calle: ");
                var number = rs.questionInt("Ingrese Nro: ");
                var apartment = rs.question("Ingrese Dpto: ");
                var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
                //this.libraryItems.push(newItem);
            }
            else {
                console.log(" Update Cancelled. LibraryItem not Updated. \n");
            }
        }
        else {
            console.log("LibraryItem not found.\n");
        }
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.deleteLibraryItemMemoria = function () {
        console.log("======== Delete LibraryItem ========\n");
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.libraryItems.findIndex(function (lItems) { return lItems.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el LibraryItem con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.libraryItems[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getId(), " ? (Y/N)"));
            if (confirmation) {
                this.libraryItems.splice(recordIndex, 1);
            }
            else {
                console.log("Deletion canceled. Item not removed. \n");
            }
        }
        else {
            console.log("Item not found.\n");
        }
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.readLibraryItemsArchivos = function () {
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.libraryItems = readResult;
            console.log("========= Library Items =========\n");
            if (!this.libraryItems.length) {
                console.log("Arreglo vacío, No LibraryItems found. \n");
            }
            else {
                console.log("Cantidad de LibraryItems", this.libraryItems.length);
                this.libraryItems.forEach(function (libraryItem) { return console.log(libraryItem); });
            }
        }
        rs.keyInPause("\n");
    };
    LibraryItemsManager.prototype.createLibraryItemArchivos = function () {
        console.log("========= Create LibraryItem =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.libraryItems = readResult;
        }
        var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
        var year = rs.questionInt("Enter the year: ");
        var newItem = new libraryItem_1.LibraryItem(title, year);
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        this.libraryItems.push(newItem);
        fileManager_1.FileManager.appendLibraryItem(this.libraryItems);
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.updateLibraryItemArchivos = function () {
        console.log("========= Update LibraryItem =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.libraryItems = readResult;
        }
        rs.keyInPause();
        this.libraryItems.forEach(function (libraryItem) { return console.log(libraryItem); });
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.libraryItems.findIndex(function (lItem) { return lItem.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.libraryItems[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getId, " ?"));
            if (confirmation) {
                fileManager_1.FileManager.appendLibraryItem(this.libraryItems);
            }
            else {
                console.log(" Update Cancelled. Loan not Updated. \n");
            }
        }
        else {
            console.log("Loan not found.\n");
        }
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.deleteLibraryItemArchivos = function () {
        console.log("======== Delete LibraryItem ========\n");
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.libraryItems = readResult;
        }
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.libraryItems.findIndex(function (lItems) { return lItems.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el Loan con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.libraryItems[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getId(), " ? (Y/N)"));
            if (confirmation) {
                this.libraryItems.splice(recordIndex, 1);
                fileManager_1.FileManager.appendLibraryItem(this.libraryItems);
            }
            else {
                console.log("Deletion canceled. Item not removed. \n");
            }
        }
        else {
            console.log("Item not found.\n");
        }
        rs.keyInPause();
    };
    LibraryItemsManager.prototype.menuLibraryItemsMemoria = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsMemoria);
            switch (choice) {
                case 0:
                    this.readLibraryItemsMemoria();
                    break;
                case 1:
                    this.createLibraryItemMemoria();
                    break;
                case 2:
                    this.updateLibraryItemMemoria();
                    break;
                case 3:
                    this.deleteLibraryItemMemoria();
                    break;
                default:
                    console.log("\n        -------------\n        |           |\n        | GOOD BYE! | \n        |  SEE YOU  |\n        |   LATER   |\n        |           |\n        ------------- \n        ");
                    return;
            }
        }
    };
    LibraryItemsManager.prototype.menuLibraryItemsArchivos = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsArchivos);
            switch (choice) {
                case 0:
                    this.readLibraryItemsArchivos();
                    break;
                case 1:
                    this.createLibraryItemArchivos();
                    break;
                case 2:
                    this.updateLibraryItemArchivos();
                    break;
                case 3:
                    this.deleteLibraryItemArchivos();
                    break;
                default:
                    console.log("\n        -------------\n        |           |\n        | GOOD BYE! | \n        |  SEE YOU  |\n        |   LATER   |\n        |           |\n        ------------- \n        ");
                    return;
            }
        }
    };
    return LibraryItemsManager;
}());
exports.LibraryItemsManager = LibraryItemsManager;
