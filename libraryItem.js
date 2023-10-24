"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibraryItem = void 0;
var node_crypto_1 = require("node:crypto");
//Items (libros o revistas)
var LibraryItem = /** @class */ (function () {
    function LibraryItem(title, year) {
        this.id = (0, node_crypto_1.randomUUID)();
        this.title = title;
        this.year = year;
        this.isAvailable = true;
    }
    LibraryItem.prototype.setTitle = function (title) {
        this.title = title;
    };
    LibraryItem.prototype.setYear = function (year) {
        this.year = year;
    };
    LibraryItem.prototype.getId = function () {
        return this.id;
    };
    LibraryItem.prototype.getTitle = function () {
        return this.title;
    };
    LibraryItem.prototype.getYear = function () {
        return this.year;
    };
    LibraryItem.prototype.isItemAvailable = function () {
        return this.isAvailable;
    };
    LibraryItem.prototype.markAsUnavailable = function () {
        this.isAvailable = false;
    };
    LibraryItem.prototype.markAsAvailable = function () {
        this.isAvailable = true;
    };
    return LibraryItem;
}());
exports.LibraryItem = LibraryItem;
