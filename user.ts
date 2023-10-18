import { randomUUID as uid } from "node:crypto";
interface iAddress {
  street: string;
  number: number;
  apartment: string;
}
import { FileManager } from "./fileManager";
import * as rs from "readline-sync";

//Usuarios
export class User {
  private id: string = uid();
  private name: string;
  private address: iAddress;
  private phoneNumber: string;
  private scoring: number = 0; //acumula el scoring actual del Usuario
  private isPenalized: boolean = false; //verifica si el usuario está penalizado o no
  private penaltyDate: Date; //guarda la fecha límite de penalización
  public constructor(name: string, address: iAddress, phoneNumber: string) {
    this.name = name;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.penaltyDate = new Date();
    this.penaltyDate.setDate(this.penaltyDate.getDate() - 1);
  }

  public getId(): string {
    return this.id;
  }
  public setName(name: string): void {
    this.name = name;
  }
  public getName(): string {
    return this.name;
  }
  public setAddress(address: iAddress): void {
    this.address = address;
  }
  public getAddress(): iAddress {
    return this.address;
  }
  public setPhoneNumber(phoneNumber: string): void {
    this.phoneNumber = phoneNumber;
  }
  public getPhoneNumber(): string {
    return this.phoneNumber;
  }
  public getScoring(): number {
    return this.scoring;
  }
  public getIsPenalized(): boolean {
    return this.isPenalized;
  }
  public getPenaltyDate(): Date {
    return this.penaltyDate;
  }
  //setea la fecha límite de penalización
  public setPenaltyDate(): void {
    const today = new Date();
    this.penaltyDate.setDate(today.getDate() + 7);
  }
  public increaseScoring(points: number): void {
    this.scoring = this.scoring + points;
  }
  public decreaseScoring(points: number): void {
    this.scoring = this.scoring - points;
  }
  public penalizeUser(): void {
    this.isPenalized = true;
  }
  public decriminalizeUser(): void {
    this.isPenalized = false;
  }
}
