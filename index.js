"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var library_1 = require("./library");
var book_1 = require("./book");
var magazine_1 = require("./magazine");
var user_1 = require("./user");
//Se crea una Librería, un libro, una revista y 2 usuarios
var library = new library_1.Library();
var book01 = new book_1.Book("A sangre fría", 1977, "Rodolfo Walsh");
var book02 = new book_1.Book("El poder de las palabras", 2022, "Mariano Segman");
var magazine01 = new magazine_1.Magazine("Pronto", 2011, "Random House Penguin sarasa");
var magazine02 = new magazine_1.Magazine("Rolling Stone", 2023, "Jagger y sus Muchachos");
var user01 = new user_1.User("Marcelo Bettini", { street: "Humberto Primo", number: 602, apartment: "1C" }, "123-444-555");
var user02 = new user_1.User("Sergio Fino", { street: "Av. Alicia Moreau de Justo", number: 1050, apartment: "2B" }, "555-555-555");
var user03 = new user_1.User("Juan Perez", { street: "25 de Mayo", number: 540, apartment: "1A" }, "222-333-444");
//ESCENARIO 1, se intenta gestionar un préstamo pero el Usuario/Item no está registrado
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//ESCENARIO 2,  1 Usuario gestiona un préstamo y lo devuelve a término
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//const returnDate = new Date();
//const diasTarde = 0; // Número de días a agregar
//library.returnItem(book01, user01, returnDate);
//ESCENARIO 3,  1 Usuario gestiona un préstamo y lo devuelve fuera de término (incrementa scoring, es penalizado o cancelado)
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//const returnDate = new Date();
//const diasTarde = 8; //  Número de días a agregar (-7)
//returnDate.setDate(returnDate.getDate() + diasTarde);
//library.returnItem(book01, user01, returnDate);
//library.addItem(magazine01);
//library.loanItem(magazine01, user01);
//const returnDate02 = new Date();
//const diasTarde02 = 25; // Número de días a agregar (-7)
//returnDate02.setDate(returnDate02.getDate() + diasTarde02);
//library.returnItem(magazine01, user01, returnDate02);
//ESCENARIO 4, 1 Usuario gestiona un préstamo y lo devuelve fuera de término (incrementa scoring), luego gestiona otro
//y lo devuelve a termino (decrementa scoring)
library.addUser(user01);
library.addItem(book01);
library.loanItem(book01, user01);
var returnDate = new Date();
var diasTarde = 10; //  Número de días a agregar (-7)
returnDate.setDate(returnDate.getDate() + diasTarde);
library.returnItem(book01, user01, returnDate);
library.addItem(magazine01);
library.loanItem(magazine01, user01);
var returnDate02 = new Date();
var diasTarde02 = 0; // Número de días a agregar (-7)
returnDate02.setDate(returnDate02.getDate() + diasTarde02);
library.returnItem(magazine01, user01, returnDate02);
//ESCENARIO 5,  Otro Usuario gestiona un préstamo ya dado y se lo rechaza
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//library.addUser(user02);
//library.loanItem(book01, user02);
library.menuGralMemoria();
//library.menuGralArchivos();
//rs.keyInPause("\n");
