import { Library } from "./library";
import { Book } from "./book";
import { Magazine } from "./magazine";
import { User } from "./user";
import { LoanManager } from "./loanManager";
import * as rs from "readline-sync";
import { UserManager } from "./userManager";

//Se crea una Librería, un libro, una revista y 2 usuarios
const library = new Library();
const loanManager = new LoanManager();
const book01 = new Book("A sangre fría", 1977, "Rodolfo Walsh");
const book02 = new Book("El poder de las palabras", 2022, "Mariano Segman");
const magazine01 = new Magazine("Pronto", 2011, "Random House Penguin sarasa");
const magazine02 = new Magazine("Rolling Stone", 2023, "Jagger y sus Muchachos");
const user01 = new User(
  "Marcelo Bettini",
  { street: "Humberto Primo", number: 602, apartment: "1C"}, "123-444-555");
const user02 = new User(
  "Sergio Fino",
  { street: "Av. Alicia Moreau de Justo", number: 1050, apartment: "2B"}, "555-555-555");
const user03 = new User(
  "Juan Perez",
  { street: "25 de Mayo", number: 540, apartment: "1A"}, "222-333-444");

//ESCENARIO 1, se intenta gestionar un préstamo pero el Usuario/Item no está registrado
//library.addUser(user01);
//library.loanItem(book01, user01);
//library.addItem(book01);

//ESCENARIO 2,  1 Usuario gestiona un préstamo y lo devuelve a término
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//const returnDate = new Date();
//const diasTarde = 0; // Número de días a agregar
//library.returnItem(book01, user01, returnDate);

//ESCENARIO 3,  1 Usuario gestiona un préstamo y lo devuelve fuera de término (incrementa scoring o es cancelado)
//library.addItem(book01);
//library.addUser(user01);
//library.loanItem(book01, user01);
//const returnDate = new Date();
//const diasTarde = 8; //  Número de días a agregar (-7)
//returnDate.setDate(returnDate.getDate() + diasTarde);
//library.returnItem(book01, user01, returnDate);
//library.addItem(magazine01);
//library.loanItem(magazine01, user01);
//const returnDate02 = new Date();
//const diasTarde02 = 20; // Número de días a agregar (-7)
//returnDate02.setDate(returnDate02.getDate() + diasTarde02);
//library.returnItem(magazine01, user01, returnDate02);



//ESCENARIO 4,  Otro Usuario gestiona un préstamo ya dado y se lo rechaza
//library.addUser(user01);
//library.addItem(book01);
//library.loanItem(book01, user01);
//library.addUser(user02);
//library.loanItem(book01, user02);

console.log("Antes de ir a Menu");
rs.keyInPause("\n");
//loanManager.menuLoan();
library.menuGral();
console.log("Despues de ir a Menu");
rs.keyInPause("\n");