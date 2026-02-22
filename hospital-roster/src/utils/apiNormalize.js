export const normalizeArray = (input, possibleKeys = []) => {
  if (!input) return [];

  if (Array.isArray(input)) return input;

  if (typeof input === "object") {
    for (const key of possibleKeys) {
      if (Array.isArray(input[key])) return input[key];
    }

    if (Array.isArray(input.data)) return input.data;
  }

  return [];
};
