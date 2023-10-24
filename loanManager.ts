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

  readLoansMemoria() {
    console.log("========= Loans =========\n");
      if (!this.loans.length) {
        console.log("Arreglo vacío, No items found. \n");
      } else {
        console.log("cantidad de Items", this.loans.length);
        this.loans.forEach((loan) => console.log(loan));
      }
    rs.keyInPause("\n");
  }
  createLoanMemoria() {
    console.log("========= Create Loan =========");
    rs.keyInPause();
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
    console.log (this.loans);
    rs.keyInPause();
  }
  updateLoanMemoria() {
    console.log("========= Update Loan =========");
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.loans.findIndex((loan) => loan.getId() === idToUpdate)
    rs.keyInPause();
    if (recordIndex !== -1) {
      const recordToUpdate = this.loans[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update   ${recordToUpdate.getItem} ?`);
      if (confirmation) {
        //FileManager.appendLoan(this.loans);
      } else {
        console.log(" Update Cancelled. Loan not Updated. \n");
      }
    } else {
      console.log("Loan not found.\n");
    }
    rs.keyInPause();
  }
  deleteLoanMemoria() {
    console.log("======== Delete Loan ========\n");
    const idToDelete = rs.question("Enter the Id of the Loan to delete: ");
    const recordIndex = this.loans.findIndex((loan) => loan.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el Loan con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.loans[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getItem()} ? (Y/N)`);
      if (confirmation) {
        this.loans.splice(recordIndex, 1);
      } else {
        console.log("Deletion canceled. Item not removed. \n");
      }
    } else {
      console.log("Item not found.\n");
    }
    rs.keyInPause();
  }

  readLoansArchivos() {
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
  createLoanArchivos() {
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
  updateLoanArchivos() {
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
  deleteLoanArchivos() {
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

  menuLoansMemoria() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptionsMemoria);
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
  menuOptionsMemoria = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
  
  menuLoansArchivos() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptionsArchivos);
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
  menuOptionsArchivos = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];
}