import { User } from "./user";
import { FileManager } from "./fileManager";
import * as rs from "readline-sync";

export class UserManager {
    users: User[];
    public constructor() {
      this.users = [];
    }
    readUsers() {
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
    createUser() {
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
    updateUser() {
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
            this.createUser();
          } else {
            console.log(" Update Cancelled. User not Updated. \n");
          }
        } else {
          console.log("User not found.\n");
        }
        rs.keyInPause();
    }
    deleteUser() {
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
    menuUsers() {
      while (true) {
        console.clear();
        const choice = rs.keyInSelect(this.menuOptionsUsers);
        switch (choice) {
          case 0:
            this.readUsers();
            break;
          case 1:
            this.createUser();
            break;
          case 2:
            this.updateUser();
            break;
          case 3:
            this.deleteUser();
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
    menuOptionsUsers = ["List Users", "Create Users", "Update Users", "Delete Users"]; 
}