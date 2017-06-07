/* Remove empty objects */
export const cleanup = (_obj) => {
  const obj = _obj;
  const keys = Object.keys(obj);
  keys.forEach((key) => {
    if (Object.keys(obj[key]).length === 0) {
      delete obj[key];
    }
  });
  return obj;
};
