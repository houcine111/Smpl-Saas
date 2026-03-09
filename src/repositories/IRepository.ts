export interface IRepository<T> {
    getById(id: string): Promise<T | null>
    getAll(): Promise<T[]>
    create(item: Partial<T>): Promise<T>
    update(id: string, item: Partial<T>): Promise<T>
    delete(id: string): Promise<void>
}
