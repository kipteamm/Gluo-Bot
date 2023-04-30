export default function toTitleCase<K extends string>(s: K) {
    return s[0].toUpperCase() + s.slice(1) as Capitalize<K>
}
