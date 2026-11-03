export function localStorageService(
  elementKey: string,
  elementValue?: string,
): string {
  let result = localStorage.getItem(elementKey);
  if (!result) {
    localStorage.setItem(elementKey, elementValue || "");
    result = localStorage.getItem(elementKey) || "";}
  return result;
}
