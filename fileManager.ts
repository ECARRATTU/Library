import * as fs from "node:fs";
import * as rs from "readline-sync";
import { Loan } from "./loan";
import { LibraryItem } from "./libraryItem";
import { User } from "./user";

//Clase Utilitaria
export class FileManager {
  static readUsers() {
    try {
      const users = fs.readFileSync("./users.json", { encoding: "utf-8" });
      console.log("Lectura de datos satisfactoria FileManager.readUsers");
      rs.keyInPause("\n");
      return JSON.parse(users) as User[];
    } catch (err) {
      console.log("Unexpected Error:", err);
    }
    rs.keyInPause("\n");
  }
  static appendUsers(data: User[]) {
    try {
      const users = fs.readFileSync("./users.json", { encoding: "utf-8" });
      let contenidoJSON = JSON.parse(users);
      contenidoJSON.push(data);
      fs.writeFileSync("./users.json", JSON.stringify(contenidoJSON, null, 2), {
        encoding: "utf8",
      });
    } catch (err) {
      console.log("Unexpected Error:", err);
      rs.keyInPause("\n");
    }
  }
  static readLoans() {
    try {
      const loans = fs.readFileSync("./loans.json", { encoding: "utf-8" });
      console.log("Lectura de datos satisfactoria FileManager.readLoans");
      rs.keyInPause("\n");
      return JSON.parse(loans) as Loan[];
    } catch (err) {
      console.log("Unexpected Error:", err);
    }
    rs.keyInPause("\n");
  }
  static appendLoan(data: Loan[]) {
    try {
      const loans = fs.readFileSync("./loans.json", { encoding: "utf-8" });
      let contenidoJSON = JSON.parse(loans);
      contenidoJSON.push(data);
      fs.writeFileSync("./loans.json", JSON.stringify(contenidoJSON, null, 2), {
        encoding: "utf8",
      });
    } catch (err) {
      console.log("Unexpected Error:", err);
      rs.keyInPause("\n");
    }
  }
  static readLibraryItems() {
    try {
      const libraryItems = fs.readFileSync("./libraryItems.json", { encoding: "utf-8" });
      return JSON.parse(libraryItems) as LibraryItem[];
    } catch (err) {
      console.log("Unexpected Error:", err);
    }
    rs.keyInPause("\n");
  }
  static appendLibraryItem(data: LibraryItem[]) {
    try {
      const libraryItems = fs.readFileSync("./libraryItems.json", { encoding: "utf-8" });
      let contenidoJSON = JSON.parse(libraryItems);
      contenidoJSON.push(data);
      fs.writeFileSync("./libraryItems.json", JSON.stringify(contenidoJSON, null, 2), {
        encoding: "utf8",
      });
    } catch (err) {
      console.log("Unexpected Error:", err);
      rs.keyInPause("\n");
    }
  }
}