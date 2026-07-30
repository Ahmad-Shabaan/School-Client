import { v4 as uuidv4 } from "uuid";

export function getBasketId() {
  let id = localStorage.getItem("basketId");
  // Guest browsing
  if (!id) {
    id = uuidv4();
    localStorage.setItem("basketId", id);
  }
  return id;
}
