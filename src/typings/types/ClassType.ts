export type ClassType<T> = T extends new (...args: any[]) => any ? T : never
export type ClassInstance<T> = T extends new (...args: any[]) => infer P ? P : never