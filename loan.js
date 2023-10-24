"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loan = void 0;
var node_crypto_1 = require("node:crypto");
//Préstamos
var Loan = /** @class */ (function () {
    function Loan(item, user) {
        this.id = (0, node_crypto_1.randomUUID)();
        this.item = item;
        this.user = user;
        this.loanDate = new Date();
        this.dueDate = new Date();
        this.dueDate.setDate(this.loanDate.getDate() + 7);
    }
    Loan.prototype.getId = function () {
        return this.id;
    };
    Loan.prototype.getItem = function () {
        return this.item;
    };
    Loan.prototype.getUser = function () {
        return this.user;
    };
    Loan.prototype.getLoanDate = function () {
        return this.loanDate;
    };
    Loan.prototype.getDueDate = function () {
        return this.dueDate;
    };
    return Loan;
}());
exports.Loan = Loan;
