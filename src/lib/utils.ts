type keys = "token" | "userId" | "role";

export function getFromObject(obj: Object, key: keys) {
  return Object.getOwnPropertyDescriptor(obj, key)?.value as string;
}

export function addToObject(obj: Object, key: keys, value: string) {
  Object.defineProperty(obj, key, {
    value: value,
    writable: false,
  });
}

export function removeDuplicatesAndMerge<T>(arr1: Array<T>, arr2: Array<T>) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const setMerged = new Set([...set1, ...set2]);

  return Array.from(setMerged);
}
