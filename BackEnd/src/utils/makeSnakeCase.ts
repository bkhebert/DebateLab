export default function makeSnakeCase(input: string): string {
    return input
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/-/g, '_');
};