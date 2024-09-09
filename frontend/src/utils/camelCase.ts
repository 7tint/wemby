import { mapKeys, camelCase, isObject, mapValues } from "lodash-es";

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    // Process arrays recursively
    return obj.map((item) => toCamelCase(item));
  } else if (isObject(obj)) {
    // Process each key and value recursively
    return mapValues(
      mapKeys(obj, (_, key) => camelCase(key)),
      (value) => toCamelCase(value)
    );
  }
  return obj;
};

export default toCamelCase;
