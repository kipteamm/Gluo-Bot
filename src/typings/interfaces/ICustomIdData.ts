export interface ICustomIdData {
    // The name it must start with
    begin?: string

    // Values it must include in the string
    include?: string[]

    // The value it has to end with
    end?: string

    // List of allowed ids
    ids?: string[]
}