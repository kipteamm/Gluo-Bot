export default function<T extends object>(data: T) {
    return Object.keys(data) as Array<keyof T>
}