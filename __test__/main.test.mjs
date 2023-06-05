import { jest } from "@jest/globals";

jest.unstable_mockModule("../helpers/secondary.mjs", () => {
  return {
    default: () => false
  };
});

jest.unstable_mockModule("axios", () => {
  return {
    default: {
      get: () => {
        return new Promise(resolve => resolve({ data: 10 }));
      }
    }
  };
});

let secondary = (await import("../helpers/secondary.mjs")).default;
let main = (await import("../helpers/main.mjs")).default;
// let main;
beforeAll(async () => {

  console.log(secondary(), "<-=-=-=-=-=--=-=");
});

test("works", async () => {
  // secondary.mockReturnValueOnce(false); // TypeError: Cannot read property 'mockReturnValueOnce' of undefined
  const data = await main();
  expect(data).toBe(false);
});