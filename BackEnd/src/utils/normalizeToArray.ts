export default function normalizeToArray(input: string | string[]): string[] {
  console.log('TURNING THIS TO ARR', input)
  if (typeof input === "string") {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      // If parsing fails, treat the string as a single-element array
      return [input];
    }
  } else if (Array.isArray(input)) {
    return input;
  }

  return [];
}