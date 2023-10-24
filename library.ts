import { LibraryItem } from "./libraryItem";
import { Loan } from "./loan";
import { User } from "./user";
import { FileManager } from "./fileManager"; 
import * as rs from "readline-sync";
import { UserManager } from "./userManager";
import { LoanManager } from "./loanManager";
import { LibraryItemsManager } from "./libraryItemsManager";
import { log } from "node:console";

//Biblioteca, Clase Gestora
export class Library {
  private items: LibraryItem[];
  private users: User[];
  private loans: Loan[];
  public constructor() {
    this.items = [];
    this.users = [];
    this.loans = [];
  }
  addItem(item: LibraryItem): void {
    this.items.push(item);
    FileManager.appendLibraryItem(this.items);
  }
  addUser(user: User): void {
    this.users.push(user);
    FileManager.appendUsers(this.users);
  }

  loanItem(item: LibraryItem, user: User): void {
    //se evalúa primero si el usuario es válido y luego si está penalizado
    if (!this.isUserValid(user)) {
      console.log("Usuario no registrado");
      rs.keyInPause("\n");
      return;
    } else {
      //se verifica si el usuario está penalizado
      if (this.isUserPenalized(user)) {
        //se chequea hasta qué fecha está penalizado
        const today = new Date();
        if (this.penaltyDate(user)>= today) {
          console.log("Usuario penalizado hasta: ", this.penaltyDate(user).toLocaleDateString());
          return;
        } else {
          //la fecha de penalización terminó, se levanta la sanción
          user.decriminalizeUser();
        }
      }
    }
    //se evalúa si existe el Item a prestar
    const existingItem: LibraryItem | undefined = this.findItem(item);
    if (!existingItem || !existingItem.isItemAvailable()) {
      console.log("Item no está disponible.");
      rs.keyInPause("\n");
      return;
    }
    //pasó todas las validaciones, se marca el Item como no disponible y se suma al arreglo de items
    existingItem.markAsUnavailable();
    const loan = new Loan(existingItem, user);
    this.loans.push(loan);
    FileManager.appendLoan(this.loans);
    console.log(
      `${user.getName()} retira "${item.getTitle()}" con fecha de devolución ${loan
        .getDueDate()
        .toLocaleDateString()}`
    );
    rs.keyInPause("\n");
  }

  returnItem(item: LibraryItem, user: User, returnDate: Date): void {
    const loan = this.findActiveLoan(item, user);
    if (!loan) {
        throw new Error("Préstamo no registrado. Revise Título y Usuario");
      return;
    }
    const existingItem = this.findItem(item);
    if (existingItem) {
      existingItem.markAsAvailable();
    }
    const dueDate = loan.getDueDate();
    console.log("Fecha de devolución prevista: ",dueDate.toLocaleDateString());
    console.log("Fecha de devolución efectiva: ",returnDate.toLocaleDateString());
    console.log("Scoring del Usuario al devolver el Item: ", user.getScoring());
    rs.keyInPause("\n");
    if (returnDate > dueDate) {
      //Se calcula la diferencia en días entre returnDate y dueDate y se almacena en lateDays
      const lateDays = Math.ceil((returnDate.getTime() - dueDate.getTime()) / (1000 * 3600 * 24));
      console.log("Cantidad de días de retardo: ", lateDays-1);
      switch(lateDays-1) {
          case 1: 
            user.increaseScoring(2);
            break;
          case 2: case 3: case 4: case 5:
            user.increaseScoring(3);
            break;
          case 6: case 7: case 8: case 9: case 10:
            user.increaseScoring(6);
            break;
          //El Usuario devuelve el item luego de 10 días, se lo elimina
          default:
            //se elimina el usuario del arreglo
            this.users = this.users.filter(u => u !== user);
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
    } else {
      console.log(`${user.getName()} devolvió "${item.getTitle()}" a tiempo.`);
      if (user.getScoring() > 0) {
        user.decreaseScoring(1);
      }
    }
    this.loans = this.loans.filter((resLoan) => resLoan !== loan);
    console.log(`${user.getName()} devolvió "${item.getTitle()}" en la fecha "${returnDate.toLocaleDateString()}"`);
    console.log("Scoring del Usuario luego de devolver el Item: ", user.getScoring());
    rs.keyInPause("\n");
  }
  private findActiveLoan(item: LibraryItem, user: User): Loan | undefined {
    return this.loans.find(
      (loan) => loan.getItem() === item && loan.getUser() === user
    );
  }
  private isUserValid(user: User): boolean {
    return this.users.includes(user);
  }
  private findItem(item: LibraryItem): LibraryItem | undefined {
    return this.items.find((i) => i === item);
  }
  private findUser(user: User): User | undefined{
    return this.users.find((u) => u === user);
  }
  private isUserPenalized(user: User): boolean {
    return this.findUser(user).getIsPenalized();
  }
  private penaltyDate(user: User): Date {
    return this.findUser(user).getPenaltyDate();
  }
  
  readUsersMemoria() {
    console.log("========= Users =========\n");
    if (!this.users.length) {
      console.log("Arreglo vacío, No Users found. \n");
    } else {
      console.log("Cantidad de Users", this.users.length);
      this.users.forEach((user) => console.log(user));
    } 
    rs.keyInPause("\n");
  }
  createUserMemoria() {
    console.log("========= Create User =========");
    const name = rs.question("Ingrese el Nombre del Usuario: ");
    const street = rs.question("Ingrese Calle: ");
    const number = rs.questionInt("Ingrese Nro: ");
    const apartment = rs.question("Ingrese Dpto: ");
    const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
    const newUser = new User(name,{street,number,apartment},phoneNumber);
    this.users.push(newUser);
    console.log (this.users);
    rs.keyInPause();
  }
  updateUserMemoria() {
    console.log("========= Update User =========");
    rs.keyInPause();
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.users.findIndex((user) => user.getId() === idToUpdate)
    if (recordIndex !== -1) {
      const recordToUpdate = this.users[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update ${recordToUpdate.getName} ?`);
      if (confirmation) {
        const name = rs.question("Ingrese el Nombre del Usuario: ");
        const street = rs.question("Ingrese Calle: ");
        const number = rs.questionInt("Ingrese Nro: ");
        const apartment = rs.question("Ingrese Dpto: ");
        const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        const newUser = new User(name,{street,number,apartment},phoneNumber);
        this.users[recordIndex] = newUser;
        rs.keyInPause();
      } else {
        console.log(" Update Cancelled. User not Updated. \n");
      }
    } else {
      console.log("User not found.\n");
    }
    rs.keyInPause();
  }
  deleteUserMemoria() {
    console.log("======== Delete User ========\n");
    const idToDelete = rs.question("Enter the Id of the User to delete: ");
    const recordIndex = this.users.findIndex((user) => user.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el User con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.users[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getName()} ? (Y/N)`);
      if (confirmation) {
        this.users.splice(recordIndex, 1);
      } else {
        console.log("Deletion canceled. User not removed. \n");
      }
    } else {
      console.log("User not found.\n");
    }
    rs.keyInPause();
  }

  readUsersArchivos() {
    const readResult = FileManager.readUsers();
    if (readResult) {
      this.users = readResult;
      console.log("========= Users =========\n");
      if (!this.users.length) {
        console.log("Arreglo vacío, No Users found. \n");
      } else {
        console.log("Cantidad de Users", this.users.length);
        this.users.forEach((user) => console.log(user));
      } 
    } 
    rs.keyInPause("\n");
  }
  createUserArchivos() {
    console.log("========= Create User =========");
    rs.keyInPause();
    const readResult = FileManager.readUsers();
    if (readResult) {
      this.users = readResult;
    }
    const name  = rs.question("Ingrese el Nombre del Usuario: ");
    const street = rs.question("Ingrese Calle: ");
    const number = rs.questionInt("Ingrese Nro: ");
    const apartment = rs.question("Ingrese Dpto: ");
    const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
    const newUser = new User(name,{street,number,apartment},phoneNumber);
    this.users.push(newUser);
    FileManager.appendUsers(this.users);
    console.log (this.users);
    rs.keyInPause();
  }  
  updateUserArchivos() {
    console.log("========= Update User =========");
    rs.keyInPause();
    const readResult = FileManager.readUsers();
    if (readResult) {
      this.users = readResult;
    }
    console.log(readResult);
    rs.keyInPause();
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.users.findIndex((user) => user.getId() === idToUpdate)
    if (recordIndex !== -1) {
      const recordToUpdate = this.users[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update   ${recordToUpdate.getName} ?`);
      if (confirmation) {
       // this.createUser();
      } else {
        console.log(" Update Cancelled. User not Updated. \n");
      }
    } else {
      console.log("User not found.\n");
    }
    rs.keyInPause();
  }
  deleteUserArchivos() {
    console.log("======== Delete User ========\n");
    const readResult = FileManager.readUsers();
    if (readResult) {
      this.users = readResult;
    }
    const idToDelete = rs.question("Enter the Id of the User to delete: ");
    const recordIndex = this.users.findIndex((user) => user.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el User con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.users[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getName()} ? (Y/N)`);
      if (confirmation) {
        this.users.splice(recordIndex, 1);
        FileManager.appendUsers(this.users);
      } else {
        console.log("Deletion canceled. User not removed. \n");
      }
    } else {
      console.log("User not found.\n");
    }
    rs.keyInPause();
  }

  readLibraryItemsMemoria() {
    if (!this.items.length) {
      console.log("Arreglo vacío, No LibraryItems found. \n");
    } else {
      console.log("========= Library Items =========\n");
      console.log("Cantidad de LibraryItems", this.items.length);
      this.items.forEach((libraryItem) => console.log(libraryItem));
    }
    rs.keyInPause("\n");
  }
  createLibraryItemMemoria() {
    console.log("========= Create LibraryItem =========");
    rs.keyInPause();
    const title  = rs.question("Ingrese un Titulo para el LibraryItem: ");
    const year = rs.questionInt("Enter the year: ");
    const newItem = new LibraryItem(title,year);
    const name  = rs.question("Ingrese el Nombre del Usuario: ");
    const street = rs.question("Ingrese Calle: ");
    const number = rs.questionInt("Ingrese Nro: ");
    const apartment = rs.question("Ingrese Dpto: ");
    const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
    this.items.push(newItem);
    rs.keyInPause();
  }
  updateLibraryItemMemoria() {
    console.log("========= Update LibraryItem =========");
    rs.keyInPause();
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.items.findIndex((lItem) => lItem.getId() === idToUpdate)
    if (recordIndex !== -1) {
      const recordToUpdate = this.items[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update   ${recordToUpdate.getId} ?`);
      if (confirmation) {
        const title  = rs.question("Ingrese un Titulo para el LibraryItem: ");
        recordToUpdate.setTitle(title);
        const year = rs.questionInt("Enter the year: ");
        recordToUpdate.setYear(year);
        const newItem = new LibraryItem(title,year);
        const name  = rs.question("Ingrese el Nombre del Usuario: ");
        const street = rs.question("Ingrese Calle: ");
        const number = rs.questionInt("Ingrese Nro: ");
        const apartment = rs.question("Ingrese Dpto: ");
        const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
        //this.libraryItems.push(newItem);
      } else {
        console.log(" Update Cancelled. LibraryItem not Updated. \n");
      }
    } else {
      console.log("LibraryItem not found.\n");
    }
    rs.keyInPause();
  }
  deleteLibraryItemMemoria() {
    console.log("======== Delete LibraryItem ========\n");
    const idToDelete = rs.question("Enter the Id of the Loan to delete: ");
    const recordIndex = this.items.findIndex((lItems) => lItems.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el LibraryItem con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.items[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getId()} ? (Y/N)`);
      if (confirmation) {
        this.items.splice(recordIndex, 1);
      } else {
        console.log("Deletion canceled. Item not removed. \n");
      }
    } else {
      console.log("Item not found.\n");
    }
    rs.keyInPause();
  }

  readLibraryItemsArchivos() {
    const readResult = FileManager.readLibraryItems();
    if (readResult) {
      this.items = readResult;
      console.log("========= Library Items =========\n");
      if (!this.items.length) {
        console.log("Arreglo vacío, No LibraryItems found. \n");
      } else {
        console.log("Cantidad de LibraryItems", this.items.length);
        this.items.forEach((libraryItem) => console.log(libraryItem));
      } 
    } 
    rs.keyInPause("\n");
  }
  createLibraryItemArchivos() {
    console.log("========= Create LibraryItem =========");
    rs.keyInPause();
    const readResult = FileManager.readLibraryItems();
    if (readResult) {
      this.items = readResult;
    }
    const title  = rs.question("Ingrese un Titulo para el LibraryItem: ");
    const year = rs.questionInt("Enter the year: ");
    const newItem = new LibraryItem(title,year);
    const name  = rs.question("Ingrese el Nombre del Usuario: ");
    const street = rs.question("Ingrese Calle: ");
    const number = rs.questionInt("Ingrese Nro: ");
    const apartment = rs.question("Ingrese Dpto: ");
    const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
    this.items.push(newItem);
    FileManager.appendLibraryItem(this.items);
    rs.keyInPause();
  }
  updateLibraryItemArchivos() {
    console.log("========= Update LibraryItem =========");
    rs.keyInPause();
    const readResult = FileManager.readLibraryItems();
    if (readResult) {
      this.items = readResult;
    }
    rs.keyInPause();
    this.items.forEach((libraryItem) => console.log(libraryItem));
    rs.keyInPause();
    const idToUpdate = rs.question("Enter the ID of the record to update: ");
    const recordIndex = this.items.findIndex((lItem) => lItem.getId() === idToUpdate)
    if (recordIndex !== -1) {
      const recordToUpdate = this.items[recordIndex];
      const confirmation = rs.keyInYN(
        `Do you want to Update   ${recordToUpdate.getId} ?`);
      if (confirmation) {
        FileManager.appendLibraryItem(this.items);
      } else {
        console.log(" Update Cancelled. Loan not Updated. \n");
      }
    } else {
      console.log("Loan not found.\n");
    }
    rs.keyInPause();
  }
  deleteLibraryItemArchivos() {
    console.log("======== Delete LibraryItem ========\n");
    const readResult = FileManager.readLibraryItems();
    if (readResult) {
      this.items = readResult;
    }
    const idToDelete = rs.question("Enter the Id of the Loan to delete: ");
    const recordIndex = this.items.findIndex((lItems) => lItems.getId() === idToDelete);
    if (recordIndex !== -1) {
      console.log("Encontró el Loan con Id: ", idToDelete);
      rs.keyInPause();
      const recordToDelete = this.items[recordIndex];
      const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getId()} ? (Y/N)`);
      if (confirmation) {
        this.items.splice(recordIndex, 1);
        FileManager.appendLibraryItem(this.items);
      } else {
        console.log("Deletion canceled. Item not removed. \n");
      }
    } else {
      console.log("Item not found.\n");
    }
    rs.keyInPause();
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
        this.loans[recordIndex] = newLoan;
        rs.keyInPause();
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
      const choice = rs.keyInSelect(this.menuLoanOptionsArchivos);
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
  menuLoanOptionsArchivos = ["List Loans", "Create Loan", "Update Loan", "Delete Loan"];

  menuLibraryItemsMemoria() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuLibraryItemsOptionsMemoria);
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
  menuLibraryItemsOptionsMemoria = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];

  menuLibraryItemsArchivos() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptionsArchivos);
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
  menuOptionsArchivos = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];

  menuUsersMemoria() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptionsUsersMemoria);
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
  menuOptionsUsersMemoria = ["List Users", "Create Users", "Update Users", "Delete Users"]; 

  menuUsersArchivos() {
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptionsUsersArchivos);
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
  menuOptionsUsersArchivos = ["List Users", "Create Users", "Update Users", "Delete Users"]; 
  
  menuGralMemoria() {
    console.log("En MENU GRAL MEMORIA");
    rs.keyInPause("\n");
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuGralOptionsMemoria);
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
  menuGralOptionsMemoria = ["LibraryItems", "Loans", "Users"]

  menuGralArchivos() {
    console.log("En MENU GRAL ARCHIVOS");
    rs.keyInPause("\n");
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuGralOptionsArchivos);
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
  menuGralOptionsArchivos= ["LibraryItems", "Loans", "Users"]
}
