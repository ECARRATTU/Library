import { LibraryItem } from "./libraryItem";
import { Loan } from "./loan";
import { User } from "./user";
import { FileManager } from "./fileManager"; 
import * as rs from "readline-sync";
import { UserManager } from "./userManager";
import { LoanManager } from "./loanManager";
import { LibraryItemsManager } from "./libraryItemsManager";

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
  

  libraryItemsInstance = new LibraryItemsManager
  userManagerInstance = new UserManager
  loansInstance = new LoanManager

  menuGral() {
    console.log("En MENU GRAL");
    rs.keyInPause("\n");
    while (true) {
      console.clear();
      const choice = rs.keyInSelect(this.menuOptions);
      switch (choice) {
        case 0:
          this.libraryItemsInstance.menuLibraryItems();
          break;
        case 1:
          this.loansInstance.menuLoan();
          break;
        case 2:
          this.userManagerInstance.menuUsers();
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
  menuOptions = ["LibraryItems", "Loans", "Users"]
}
