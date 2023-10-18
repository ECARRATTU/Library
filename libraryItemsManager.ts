import { LibraryItem } from "./libraryItem";
import * as rs from "readline-sync";
import { FileManager } from "./fileManager";

export class LibraryItemsManager {
    libraryItems: LibraryItem[];
    public constructor() {
      this.libraryItems = [];
    }
    readLibraryItems() {
      const readResult = FileManager.readLibraryItems();
      if (readResult) {
        this.libraryItems = readResult;
        console.log("========= Library Items =========\n");
        if (!this.libraryItems.length) {
          console.log("Arreglo vacío, No LibraryItems found. \n");
        } else {
          console.log("Cantidad de LibraryItems", this.libraryItems.length);
          this.libraryItems.forEach((libraryItem) => console.log(libraryItem));
        } 
      } 
      rs.keyInPause("\n");
    }
    createLibraryItem() {
      console.log("========= Create LibraryItem =========");
      rs.keyInPause();
      const readResult = FileManager.readLibraryItems();
      if (readResult) {
        this.libraryItems = readResult;
      }
      const title  = rs.question("Ingrese un Titulo para el LibraryItem: ");
      const year = rs.questionInt("Enter the year: ");
      const newItem = new LibraryItem(title,year);
      const name  = rs.question("Ingrese el Nombre del Usuario: ");
      const street = rs.question("Ingrese Calle: ");
      const number = rs.questionInt("Ingrese Nro: ");
      const apartment = rs.question("Ingrese Dpto: ");
      const phoneNumber = rs.question("Ingrese Nro de Telefono: ");
      this.libraryItems.push(newItem);
      FileManager.appendLibraryItem(this.libraryItems);
      rs.keyInPause();
    }
    updateLibraryItem() {
      console.log("========= Update LibraryItem =========");
      rs.keyInPause();
      const readResult = FileManager.readLibraryItems();
      if (readResult) {
        this.libraryItems = readResult;
      }
      rs.keyInPause();
      this.libraryItems.forEach((libraryItem) => console.log(libraryItem));
      rs.keyInPause();
      const idToUpdate = rs.question("Enter the ID of the record to update: ");
      const recordIndex = this.libraryItems.findIndex((lItem) => lItem.getId() === idToUpdate)
      if (recordIndex !== -1) {
        const recordToUpdate = this.libraryItems[recordIndex];
        const confirmation = rs.keyInYN(
          `Do you want to Update   ${recordToUpdate.getId} ?`);
        if (confirmation) {
          FileManager.appendLibraryItem(this.libraryItems);
        } else {
          console.log(" Update Cancelled. Loan not Updated. \n");
        }
      } else {
        console.log("Loan not found.\n");
      }
      rs.keyInPause();
    }
    deleteLibraryItem() {
      console.log("======== Delete LibraryItem ========\n");
      const readResult = FileManager.readLibraryItems();
      if (readResult) {
        this.libraryItems = readResult;
      }
      const idToDelete = rs.question("Enter the Id of the Loan to delete: ");
      const recordIndex = this.libraryItems.findIndex((lItems) => lItems.getId() === idToDelete);
      if (recordIndex !== -1) {
        console.log("Encontró el Loan con Id: ", idToDelete);
        rs.keyInPause();
        const recordToDelete = this.libraryItems[recordIndex];
        const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getId()} ? (Y/N)`);
        if (confirmation) {
          this.libraryItems.splice(recordIndex, 1);
          FileManager.appendLibraryItem(this.libraryItems);
        } else {
          console.log("Deletion canceled. Item not removed. \n");
        }
      } else {
        console.log("Item not found.\n");
      }
      rs.keyInPause();
    }
    menuLibraryItems() {
      while (true) {
        console.clear();
        const choice = rs.keyInSelect(this.menuOptions);
        switch (choice) {
          case 0:
            this.readLibraryItems();
            break;
          case 1:
            this.createLibraryItem();
            break;
          case 2:
            this.updateLibraryItem();
            break;
          case 3:
            this.deleteLibraryItem();
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
    menuOptions = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];
  }