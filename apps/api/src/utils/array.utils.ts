export const mergeArraysByUniqueKey = (existingArray, newArray, key) => {
  const map = new Map();

  // Add existing items to the map
  existingArray.forEach((item) => {
    map.set(item[key], item);
  });

  // Override with new items
  newArray.forEach((item) => {
    map.set(item[key], item);
  });

  // Convert back to array
  return Array.from(map.values());
};
