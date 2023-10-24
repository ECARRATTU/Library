"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var node_crypto_1 = require("node:crypto");
//Usuarios
var User = /** @class */ (function () {
    function User(name, address, phoneNumber) {
        this.id = (0, node_crypto_1.randomUUID)();
        this.scoring = 0; //acumula el scoring actual del Usuario
        this.isPenalized = false; //verifica si el usuario está penalizado o no
        this.name = name;
        this.address = address;
        this.phoneNumber = phoneNumber;
        this.penaltyDate = new Date();
        this.penaltyDate.setDate(this.penaltyDate.getDate() - 1);
    }
    User.prototype.getId = function () {
        return this.id;
    };
    User.prototype.setName = function (name) {
        this.name = name;
    };
    User.prototype.getName = function () {
        return this.name;
    };
    User.prototype.setAddress = function (address) {
        this.address = address;
    };
    User.prototype.getAddress = function () {
        return this.address;
    };
    User.prototype.setPhoneNumber = function (phoneNumber) {
        this.phoneNumber = phoneNumber;
    };
    User.prototype.getPhoneNumber = function () {
        return this.phoneNumber;
    };
    User.prototype.getScoring = function () {
        return this.scoring;
    };
    User.prototype.getIsPenalized = function () {
        return this.isPenalized;
    };
    User.prototype.getPenaltyDate = function () {
        return this.penaltyDate;
    };
    //setea la fecha límite de penalización
    User.prototype.setPenaltyDate = function () {
        var today = new Date();
        this.penaltyDate.setDate(today.getDate() + 7);
    };
    User.prototype.increaseScoring = function (points) {
        this.scoring = this.scoring + points;
    };
    User.prototype.decreaseScoring = function (points) {
        this.scoring = this.scoring - points;
    };
    User.prototype.penalizeUser = function () {
        this.isPenalized = true;
    };
    User.prototype.decriminalizeUser = function () {
        this.isPenalized = false;
    };
    return User;
}());
exports.User = User;
