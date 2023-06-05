// main.js
import axios from "axios";
import secondary from "./secondary.mjs";


export default async function main() {
  const data = await axios.get("https://jsonplaceholder.typicode.com/todos/1");
  console.log(data.data);
  return secondary();
}