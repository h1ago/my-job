import { GenericRepository } from "@/domain/shared/repositories/generic-repository";
import fs from "fs-extra";
import path from "path";

export class FileRepository<T extends { id: string }>
  implements GenericRepository<T>
{
  private filePath: string = "/data/data-source.json";
  private readonly reconstruct: (data: any) => T;

  constructor(reconstruct: (data: any) => T) {
    this.reconstruct = reconstruct;
  }

  public setFileName(fileName: string) {
    this.filePath = path.resolve(__dirname, `data/${fileName}.json`);
  }

  private async readFile(): Promise<any[]> {
    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(content);
    } catch (err) {
      return [];
    }
  }

  private async writeFile(data: any[]): Promise<void> {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  async save(item: T): Promise<void> {
    const items = await this.readFile();

    const exists = items.find((i) => i.id === item.id);
    if (!exists) {
      items.push(item);
      await this.writeFile(items);
    }
  }

  async findOne(id: string): Promise<T | null> {
    const items = await this.readFile();
    const data = items.find((i) => i.id === id);

    if (!data) return null;

    return this.reconstruct(data);
  }

  async update(item: T): Promise<void> {
    const items = await this.readFile();

    const index = items.findIndex((i) => i.id === item.id);
    if (index !== -1) {
      items[index] = item;
      await this.writeFile(items);
    }
  }
}
