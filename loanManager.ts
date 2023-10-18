import { Loan } from "./loan";
import { FileManager } from "./fileManager"; 
import * as rs from "readline-sync";
import { LibraryItem } from "./libraryItem";
import { User } from "./user";

export class LoanManager {
  loans: Loan[];
  public constructor() {
    this.loans = [];
  }
  readLoans() {
    const readResult = FileManager.readLoans();
    if (readResult) {
      this.loans = readResult;
      console.log("========= Loans =========\n");
      if (!this.loans.length) {
        console.log("Arreglo vacío, No items found. \n");
      } else {
        console.log("cantidad de Items", this.loans.length);
        this.loans.forEach((loan) => console.log(loan));
      } 
    } 
    rs.keyInPause("\n");
  }
  createLoan() {
    console.log("========= Create Loan =========");
    rs.keyInPause();
    const readResult = FileManager.readLoans();
    if (readResult) {
      this.loans = readResult;
    }
    const title  = rs.question("Ingrese un Titulo para el LibraryItem: ");
    const year = rs.questionInt("Enter the year: ");
    const newItem = new LibraryItem(title,year);
    const name  = rs.question("Ingrese el Nombre del Usuario: ");
    const street = rs.question("Ingrese Calle: ");
    const number = rs.questionInt("Ingrese Nro: ");
    const apartment = rs.question("Ingrese Dpto: ");
    const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
    const newUser = new User(name,{street,number,apartment},phoneNumber);
    const newLoan = new Loan(newItem,newUser);
    this.loans.push(newLoan);
    FileManager.appendLoan(this.loans);
    console.log (this.loans);
    rs.keyInPause();
  }
  updateLoan() {
    console.log("========= Update Loan =========");
    rs.keyInPause();
    const readResult = FileManager.readLoans();
    if (readResult) {
      this.loans = readResult;
    }
    console.log(readResult);
    rs.keyInPause();
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.loans.findIndex((loan) => loan.getId() === idToUpdate)
    if (recordIndex !== -1) {
      const recordToUpdate = this.loans[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update   ${recordToUpdate.getItem} ?`);
      if (confirmation) {
        FileManager.appendLoan(this.loans);
      } else {
        console.log(" Update Cancelled. Loan not Updated. \n");
      }
    } else {
      console.log("Loan not found.\n");
    }
    rs.keyInPause();
  }
  deleteLoan() {
    console.log("======== Delete Loan ========\n");
    const readResult = FileManager.readLoans();
    if (readResult) {
      this.loans = readResult;
    }
    const idToDelete = rs.question("Enter the Id of the Loan to delete: ");
    const recordIndex = this.loans.findIndex((loan) => loan.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el Loan con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.loans[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getItem()} ? (Y/N)`);
      if (confirmation) {
        this.loans.splice(recordIndex, 1);
        FileManager.appendLoan(this.loans);
      } else {
        console.log("Deletion canceled. Item not removed. \n");
      }
    } else {
      console.log("Item not found.\n");
    }
    rs.keyInPause();
  }
  menuLoan() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptions);
      switch (choice) {
        case 0:
          this.readLoans();
          break;
        case 1:
          this.createLoan();
          break;
        case 2:
          this.updateLoan();
          break;
        case 3:
          this.deleteLoan();
          break;
        default:
          console.log(`
      -------------
      |           |
      | GOOD BYE! | 
      |  SEE YOU  |
      |   LATER   |
      |           |
      ------------- 
      `);
          return;
      }
    }
  }
  menuOptions = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
}