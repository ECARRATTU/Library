"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Library = void 0;
var libraryItem_1 = require("./libraryItem");
var loan_1 = require("./loan");
var user_1 = require("./user");
var fileManager_1 = require("./fileManager");
var rs = require("readline-sync");
//Biblioteca, Clase Gestora
var Library = /** @class */ (function () {
    function Library() {
        this.menuOptionsMemoria = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
        this.menuLoanOptionsArchivos = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
        this.menuLibraryItemsOptionsMemoria = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];
        this.menuOptionsArchivos = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];
        this.menuOptionsUsersMemoria = ["List Users", "Create Users", "Update Users", "Delete Users"];
        this.menuOptionsUsersArchivos = ["List Users", "Create Users", "Update Users", "Delete Users"];
        this.menuGralOptionsMemoria = ["LibraryItems", "Loans", "Users"];
        this.menuGralOptionsArchivos = ["LibraryItems", "Loans", "Users"];
        this.items = [];
        this.users = [];
        this.loans = [];
    }
    Library.prototype.addItem = function (item) {
        this.items.push(item);
        fileManager_1.FileManager.appendLibraryItem(this.items);
    };
    Library.prototype.addUser = function (user) {
        this.users.push(user);
        fileManager_1.FileManager.appendUsers(this.users);
    };
    Library.prototype.loanItem = function (item, user) {
        //se evalúa primero si el usuario es válido y luego si está penalizado
        if (!this.isUserValid(user)) {
            console.log("Usuario no registrado");
            rs.keyInPause("\n");
            return;
        }
        else {
            //se verifica si el usuario está penalizado
            if (this.isUserPenalized(user)) {
                //se chequea hasta qué fecha está penalizado
                var today = new Date();
                if (this.penaltyDate(user) >= today) {
                    console.log("Usuario penalizado hasta: ", this.penaltyDate(user).toLocaleDateString());
                    return;
                }
                else {
                    //la fecha de penalización terminó, se levanta la sanción
                    user.decriminalizeUser();
                }
            }
        }
        //se evalúa si existe el Item a prestar
        var existingItem = this.findItem(item);
        if (!existingItem || !existingItem.isItemAvailable()) {
            console.log("Item no está disponible.");
            rs.keyInPause("\n");
            return;
        }
        //pasó todas las validaciones, se marca el Item como no disponible y se suma al arreglo de items
        existingItem.markAsUnavailable();
        var loan = new loan_1.Loan(existingItem, user);
        this.loans.push(loan);
        fileManager_1.FileManager.appendLoan(this.loans);
        console.log("".concat(user.getName(), " retira \"").concat(item.getTitle(), "\" con fecha de devoluci\u00F3n ").concat(loan
            .getDueDate()
            .toLocaleDateString()));
        rs.keyInPause("\n");
    };
    Library.prototype.returnItem = function (item, user, returnDate) {
        var loan = this.findActiveLoan(item, user);
        if (!loan) {
            throw new Error("Préstamo no registrado. Revise Título y Usuario");
            return;
        }
        var existingItem = this.findItem(item);
        if (existingItem) {
            existingItem.markAsAvailable();
        }
        var dueDate = loan.getDueDate();
        console.log("Fecha de devolución prevista: ", dueDate.toLocaleDateString());
        console.log("Fecha de devolución efectiva: ", returnDate.toLocaleDateString());
        console.log("Scoring del Usuario al devolver el Item: ", user.getScoring());
        rs.keyInPause("\n");
        if (returnDate > dueDate) {
            //Se calcula la diferencia en días entre returnDate y dueDate y se almacena en lateDays
            var lateDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
            console.log("Cantidad de días de retardo: ", lateDays - 1);
            switch (lateDays - 1) {
                case 1:
                    user.increaseScoring(2);
                    break;
                case 2:
                case 3:
                case 4:
                case 5:
                    user.increaseScoring(3);
                    break;
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    user.increaseScoring(6);
                    break;
                //El Usuario devuelve el item luego de 10 días, se lo elimina
                default:
                    //se elimina el usuario del arreglo
                    this.users = this.users.filter(function (u) { return u !== user; });
                    console.log("Usuario cancelado");
                    rs.keyInPause("\n");
                    return;
            }
            if (user.getScoring() >= 6) {
                user.penalizeUser();
                console.log("Se penaliza al usuario por sumar 6 o más puntos");
                user.setPenaltyDate();
                console.log("Usuario penalizado hasta: ", user.getPenaltyDate().toLocaleDateString());
                rs.keyInPause("\n");
            }
        }
        else {
            console.log("".concat(user.getName(), " devolvi\u00F3 \"").concat(item.getTitle(), "\" a tiempo."));
            if (user.getScoring() > 0) {
                user.decreaseScoring(1);
            }
        }
        this.loans = this.loans.filter(function (resLoan) { return resLoan !== loan; });
        console.log("".concat(user.getName(), " devolvi\u00F3 \"").concat(item.getTitle(), "\" en la fecha \"").concat(returnDate.toLocaleDateString(), "\""));
        console.log("Scoring del Usuario luego de devolver el Item: ", user.getScoring());
        rs.keyInPause("\n");
    };
    Library.prototype.findActiveLoan = function (item, user) {
        return this.loans.find(function (loan) { return loan.getItem() === item && loan.getUser() === user; });
    };
    Library.prototype.isUserValid = function (user) {
        return this.users.includes(user);
    };
    Library.prototype.findItem = function (item) {
        return this.items.find(function (i) { return i === item; });
    };
    Library.prototype.findUser = function (user) {
        return this.users.find(function (u) { return u === user; });
    };
    Library.prototype.isUserPenalized = function (user) {
        return this.findUser(user).getIsPenalized();
    };
    Library.prototype.penaltyDate = function (user) {
        return this.findUser(user).getPenaltyDate();
    };
    Library.prototype.readUsersMemoria = function () {
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
    Library.prototype.createUserMemoria = function () {
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
    Library.prototype.updateUserMemoria = function () {
        console.log("========= Update User =========");
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.users.findIndex(function (user) { return user.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.users[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update ".concat(recordToUpdate.getName, " ?"));
            if (confirmation) {
                var name_1 = rs.question("Ingrese el Nombre del Usuario: ");
                var street = rs.question("Ingrese Calle: ");
                var number = rs.questionInt("Ingrese Nro: ");
                var apartment = rs.question("Ingrese Dpto: ");
                var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
                var newUser = new user_1.User(name_1, { street: street, number: number, apartment: apartment }, phoneNumber);
                this.users[recordIndex] = newUser;
                rs.keyInPause();
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
    Library.prototype.deleteUserMemoria = function () {
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
    Library.prototype.readUsersArchivos = function () {
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
    Library.prototype.createUserArchivos = function () {
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
    Library.prototype.updateUserArchivos = function () {
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
    Library.prototype.deleteUserArchivos = function () {
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
    Library.prototype.readLibraryItemsMemoria = function () {
        if (!this.items.length) {
            console.log("Arreglo vacío, No LibraryItems found. \n");
        }
        else {
            console.log("========= Library Items =========\n");
            console.log("Cantidad de LibraryItems", this.items.length);
            this.items.forEach(function (libraryItem) { return console.log(libraryItem); });
        }
        rs.keyInPause("\n");
    };
    Library.prototype.createLibraryItemMemoria = function () {
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
        this.items.push(newItem);
        rs.keyInPause();
    };
    Library.prototype.updateLibraryItemMemoria = function () {
        console.log("========= Update LibraryItem =========");
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.items.findIndex(function (lItem) { return lItem.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.items[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getId, " ?"));
            if (confirmation) {
                var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
                recordToUpdate.setTitle(title);
                var year = rs.questionInt("Enter the year: ");
                recordToUpdate.setYear(year);
                var newItem = new libraryItem_1.LibraryItem(title, year);
                var name_2 = rs.question("Ingrese el Nombre del Usuario: ");
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
    Library.prototype.deleteLibraryItemMemoria = function () {
        console.log("======== Delete LibraryItem ========\n");
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.items.findIndex(function (lItems) { return lItems.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el LibraryItem con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.items[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getId(), " ? (Y/N)"));
            if (confirmation) {
                this.items.splice(recordIndex, 1);
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
    Library.prototype.readLibraryItemsArchivos = function () {
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.items = readResult;
            console.log("========= Library Items =========\n");
            if (!this.items.length) {
                console.log("Arreglo vacío, No LibraryItems found. \n");
            }
            else {
                console.log("Cantidad de LibraryItems", this.items.length);
                this.items.forEach(function (libraryItem) { return console.log(libraryItem); });
            }
        }
        rs.keyInPause("\n");
    };
    Library.prototype.createLibraryItemArchivos = function () {
        console.log("========= Create LibraryItem =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.items = readResult;
        }
        var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
        var year = rs.questionInt("Enter the year: ");
        var newItem = new libraryItem_1.LibraryItem(title, year);
        var name = rs.question("Ingrese el Nombre del Usuario: ");
        var street = rs.question("Ingrese Calle: ");
        var number = rs.questionInt("Ingrese Nro: ");
        var apartment = rs.question("Ingrese Dpto: ");
        var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        this.items.push(newItem);
        fileManager_1.FileManager.appendLibraryItem(this.items);
        rs.keyInPause();
    };
    Library.prototype.updateLibraryItemArchivos = function () {
        console.log("========= Update LibraryItem =========");
        rs.keyInPause();
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.items = readResult;
        }
        rs.keyInPause();
        this.items.forEach(function (libraryItem) { return console.log(libraryItem); });
        rs.keyInPause();
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.items.findIndex(function (lItem) { return lItem.getId() === idToUpdate; });
        if (recordIndex !== -1) {
            var recordToUpdate = this.items[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getId, " ?"));
            if (confirmation) {
                fileManager_1.FileManager.appendLibraryItem(this.items);
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
    Library.prototype.deleteLibraryItemArchivos = function () {
        console.log("======== Delete LibraryItem ========\n");
        var readResult = fileManager_1.FileManager.readLibraryItems();
        if (readResult) {
            this.items = readResult;
        }
        var idToDelete = rs.question("Enter the Id of the Loan to delete: ");
        var recordIndex = this.items.findIndex(function (lItems) { return lItems.getId() === idToDelete; });
        if (recordIndex !== -1) {
            console.log("Encontró el Loan con Id: ", idToDelete);
            rs.keyInPause();
            var recordToDelete = this.items[recordIndex];
            var confirmation = rs.keyInYN("Do you want to delete ".concat(recordToDelete.getId(), " ? (Y/N)"));
            if (confirmation) {
                this.items.splice(recordIndex, 1);
                fileManager_1.FileManager.appendLibraryItem(this.items);
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
    Library.prototype.readLoansMemoria = function () {
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
    Library.prototype.createLoanMemoria = function () {
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
    Library.prototype.updateLoanMemoria = function () {
        console.log("========= Update Loan =========");
        var idToUpdate = rs.question("Enter the ID of the record to update: ");
        var recordIndex = this.loans.findIndex(function (loan) { return loan.getId() === idToUpdate; });
        rs.keyInPause();
        if (recordIndex !== -1) {
            var recordToUpdate = this.loans[recordIndex];
            var confirmation = rs.keyInYN("Do you want to Update   ".concat(recordToUpdate.getItem, " ?"));
            if (confirmation) {
                var title = rs.question("Ingrese un Titulo para el LibraryItem: ");
                var year = rs.questionInt("Enter the year: ");
                var newItem = new libraryItem_1.LibraryItem(title, year);
                var name_3 = rs.question("Ingrese el Nombre del Usuario: ");
                var street = rs.question("Ingrese Calle: ");
                var number = rs.questionInt("Ingrese Nro: ");
                var apartment = rs.question("Ingrese Dpto: ");
                var phoneNumber = rs.question("Ingrese Nro de Telefono: ");
                var newUser = new user_1.User(name_3, { street: street, number: number, apartment: apartment }, phoneNumber);
                var newLoan = new loan_1.Loan(newItem, newUser);
                this.loans[recordIndex] = newLoan;
                rs.keyInPause();
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
    Library.prototype.deleteLoanMemoria = function () {
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
    Library.prototype.readLoansArchivos = function () {
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
    Library.prototype.createLoanArchivos = function () {
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
    Library.prototype.updateLoanArchivos = function () {
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
    Library.prototype.deleteLoanArchivos = function () {
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
    Library.prototype.menuLoansMemoria = function () {
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
    Library.prototype.menuLoansArchivos = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuLoanOptionsArchivos);
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
    Library.prototype.menuLibraryItemsMemoria = function () {
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuLibraryItemsOptionsMemoria);
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
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    Library.prototype.menuLibraryItemsArchivos = function () {
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
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    Library.prototype.menuUsersMemoria = function () {
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
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    Library.prototype.menuUsersArchivos = function () {
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
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    Library.prototype.menuGralMemoria = function () {
        console.log("En MENU GRAL MEMORIA");
        rs.keyInPause("\n");
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuGralOptionsMemoria);
            switch (choice) {
                case 0:
                    this.menuLibraryItemsMemoria();
                    break;
                case 1:
                    this.menuLoansMemoria();
                    break;
                case 2:
                    this.menuUsersMemoria();
                    break;
                default:
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    Library.prototype.menuGralArchivos = function () {
        console.log("En MENU GRAL ARCHIVOS");
        rs.keyInPause("\n");
        while (true) {
            console.clear();
            var choice = rs.keyInSelect(this.menuGralOptionsArchivos);
            switch (choice) {
                case 0:
                    this.menuLibraryItemsArchivos();
                    break;
                case 1:
                    this.menuLoansArchivos();
                    break;
                case 2:
                    this.menuUsersArchivos();
                    break;
                default:
                    console.log("\n      -------------\n      |           |\n      | GOOD BYE! | \n      |  SEE YOU  |\n      |   LATER   |\n      |           |\n      ------------- \n      ");
                    return;
            }
        }
    };
    return Library;
}());
exports.Library = Library;
