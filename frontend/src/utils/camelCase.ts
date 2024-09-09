import { mapKeys, camelCase, isObject } from "lodash-es";

const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  } else if (isObject(obj)) {
    return mapKeys(obj, (_, key) => camelCase(key));
  }
  return obj;
};

export default toCamelCase;
