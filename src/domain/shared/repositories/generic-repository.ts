export interface GenericRepository<T> {
  save(item: T): Promise<void>;
  findOne(id: string): Promise<T | null>;
  update(item: T): Promise<void>;
}
