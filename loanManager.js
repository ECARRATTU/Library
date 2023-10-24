"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanManager = void 0;
var loan_1 = require("./loan");
var fileManager_1 = require("./fileManager");
var rs = require("readline-sync");
var libraryItem_1 = require("./libraryItem");
var user_1 = require("./user");
var LoanManager = /** @class */ (function () {
    function LoanManager() {
        this.menuOptionsMemoria = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
        this.menuOptionsArchivos = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
        this.loans = [];
    }
    LoanManager.prototype.readLoansMemoria = function () {
        console.log("========= Loans =========\n");
        if (!this.loans.length) {
            console.log("Arreglo vacío, No items found. \n");
        }
        else {
            console.log("cantidad de Items", this.loans.length);
            this.loans.forEach(function (loan) { return console.log(loan); });
        }
        rs.keyInPause("\n");
    };
    LoanManager.prototype.createLoanMemoria = function () {
        console.log("========= Create Loan =========");
        rs.keyInPause();
        var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
        var year = rs.questionInt("Enter the year: ");
        var newItem = new libraryItem_1.LibraryItem(title, year);
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        var newUser = new user_1.User(name, { street: street, number: number, apartment: apartment }, phoneNumber);
        var newLoan = new loan_1.Loan(newItem, newUser);
        this.loans.push(newLoan);
        console.log(this.loans);
        rs.keyInPause();
    };
    LoanManager.prototype.updateLoanMemoria = function () {
        console.log("========= Update Loan =========");
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.loans.findIndex(function (loan) { return loan.getId() === idToUpdate; });
        rs.keyInPause();
        if (recordIndex !== -1) {
            var recordToUpdate = this.loans[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getItem, " ?"));
            if (confirmation) {
                //FileManager.appendLoan(this.loans);
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
    LoanManager.prototype.deleteLoanMemoria = function () {
        console.log("======== Delete Loan ========\n");
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.loans.findIndex(function (loan) { return loan.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el Loan con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.loans[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getItem(), " ? (Y/N)"));
            if (confirmation) {
                this.loans.splice(recordIndex, 1);
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
    LoanManager.prototype.readLoansArchivos = function () {
        var readResult = fileManager_1.FileManager.readLoans();
        if (readResult) {
            this.loans = readResult;
            console.log("========= Loans =========\n");
            if (!this.loans.length) {
                console.log("Arreglo vacío, No items found. \n");
            }
            else {
                console.log("cantidad de Items", this.loans.length);
                this.loans.forEach(function (loan) { return console.log(loan); });
            }
        }
        rs.keyInPause("\n");
    };
    LoanManager.prototype.createLoanArchivos = function () {
        console.log("========= Create Loan =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLoans();
        if (readResult) {
            this.loans = readResult;
        }
        var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
        var year = rs.questionInt("Enter the year: ");
        var newItem = new libraryItem_1.LibraryItem(title, year);
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        var newUser = new user_1.User(name, { street: street, number: number, apartment: apartment }, phoneNumber);
        var newLoan = new loan_1.Loan(newItem, newUser);
        this.loans.push(newLoan);
        fileManager_1.FileManager.appendLoan(this.loans);
        console.log(this.loans);
        rs.keyInPause();
    };
    LoanManager.prototype.updateLoanArchivos = function () {
        console.log("========= Update Loan =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLoans();
        if (readResult) {
            this.loans = readResult;
        }
        console.log(readResult);
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.loans.findIndex(function (loan) { return loan.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.loans[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getItem, " ?"));
            if (confirmation) {
                fileManager_1.FileManager.appendLoan(this.loans);
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
    LoanManager.prototype.deleteLoanArchivos = function () {
        console.log("======== Delete Loan ========\n");
        var readResult = fileManager_1.FileManager.readLoans();
        if (readResult) {
            this.loans = readResult;
        }
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.loans.findIndex(function (loan) { return loan.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el Loan con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.loans[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getItem(), " ? (Y/N)"));
            if (confirmation) {
                this.loans.splice(recordIndex, 1);
                fileManager_1.FileManager.appendLoan(this.loans);
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
    LoanManager.prototype.menuLoansMemoria = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsMemoria);
            switch (choice) {
                case 0:
                    this.readLoansMemoria();
                    break;
                case 1:
                    this.createLoanMemoria();
                    break;
                case 2:
                    this.updateLoanMemoria();
                    break;
                case 3:
                    this.deleteLoanMemoria();
                    break;
                default:
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    LoanManager.prototype.menuLoansArchivos = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuOptionsArchivos);
            switch (choice) {
                case 0:
                    this.readLoansArchivos();
                    break;
                case 1:
                    this.createLoanArchivos();
                    break;
                case 2:
                    this.updateLoanArchivos();
                    break;
                case 3:
                    this.deleteLoanArchivos();
                    break;
                default:
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    return LoanManager;
}());
exports.LoanManager = LoanManager;
