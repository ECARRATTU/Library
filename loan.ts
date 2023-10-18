import { randomUUID as uid } from "node:crypto";
interface iAddress {
  street: string;
  number: number;
  apartment: string;
}
import { LibraryItem } from "./libraryItem";
import { User } from "./user";

//Préstamos
export class Loan {
    private id: string = uid();
    private item: LibraryItem;
    private user: User;
    private loanDate: Date;
    private dueDate: Date;
  
    constructor(item: LibraryItem, user: User) {
      this.item = item;
      this.user = user;
      this.loanDate = new Date();
      this.dueDate = new Date();
      this.dueDate.setDate(this.loanDate.getDate() + 7);
    }
  
    getId(): string {
      return this.id;
    }
    getItem(): LibraryItem {
      return this.item;
    }
    getUser(): User {
      return this.user;
    }
    getLoanDate(): Date {
      return this.loanDate;
    }
    getDueDate(): Date {
      return this.dueDate;
    }
  }