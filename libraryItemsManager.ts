import { LibraryItem } from "./libraryItem";
import * as rs from "readline-sync";
import { FileManager } from "./fileManager";

export class LibraryItemsManager {
    libraryItems: LibraryItem[];
    public constructor() {
      this.libraryItems = [];
    }

    readLibraryItemsMemoria() {
      if (this.libraryItems.length = 0) {
        console.log("Arreglo vacío, No LibraryItems found. \n");
      } else {
        console.log("========= Library Items =========\n");
        console.log("Cantidad de LibraryItems", this.libraryItems.length);
        this.libraryItems.forEach((libraryItem) => console.log(libraryItem));
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
      this.libraryItems.push(newItem);
      rs.keyInPause();
    }
    updateLibraryItemMemoria() {
      console.log("========= Update LibraryItem =========");
      rs.keyInPause();
      const idToUpdate = rs.question("Enter the ID of the record to update: ");
      const recordIndex = this.libraryItems.findIndex((lItem) => lItem.getId() === idToUpdate)
      if (recordIndex !== -1) {
        const recordToUpdate = this.libraryItems[recordIndex];
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
      const recordIndex = this.libraryItems.findIndex((lItems) => lItems.getId() === idToDelete);
      if (recordIndex !== -1) {
        console.log("Encontró el LibraryItem con Id: ", idToDelete);
        rs.keyInPause();
        const recordToDelete = this.libraryItems[recordIndex];
        const confirmation = rs.keyInYN(`Do you want to delete ${recordToDelete.getId()} ? (Y/N)`);
        if (confirmation) {
          this.libraryItems.splice(recordIndex, 1);
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
    createLibraryItemArchivos() {
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
    updateLibraryItemArchivos() {
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
    deleteLibraryItemArchivos() {
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

    menuLibraryItemsMemoria() {
      while (true) {
        console.clear();
        const choice = rs.keyInSelect(this.menuOptionsMemoria);
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
    menuOptionsMemoria = ["List LibraryItems", "Create LibraryItem", "Update LibraryItems", "Delete LibraryItem"];

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
  }