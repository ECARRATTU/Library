import { randomUUID as uid } from "node:crypto";
interface iAddress {
  street: string;
  number: number;
  apartment: string;
}

//Items (libros o revistas)
export class LibraryItem {
  private id: string = uid();
  private title: string;
  private year: number;
  private isAvailable: boolean;
  public constructor(title: string, year: number) {
    this.title = title;
    this.year = year;
    this.isAvailable = true;
  }
  public setTitle(title: string): void {
    this.title = title;
  }
  public setYear(year: number): void {
    this.year = year;
  }
  public getId(): string {
    return this.id;
  }
  public getTitle(): string {
    return this.title;
  }
  public getYear(): number {
    return this.year;
  }
  public isItemAvailable(): boolean {
    return this.isAvailable;
  }
  public markAsUnavailable() {
    this.isAvailable = false;
  }
  public markAsAvailable() {
    this.isAvailable = true;
  }
}