// import test from "./assets/test.png";
import 'dotenv/config';
import { createRequire } from "node:module";
import initServer from '../config/server.mjs';
import supertest from 'supertest';
import { jest } from '@jest/globals';

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
let exportedIn = (await import("../schema/image.mjs"));

// const exported = await import('../helpers/imageUpload.mjs');

// const require = createRequire(import.meta.url);

// jest.mock('axios');
// const axios = require('axios');

// axios.get.mockResolvedValue({ "data": "asd" });

// mocking uploadImage example
// mock still failed
// jest.mock('imagekit', () => {
//   return {
//     upload: () => {
//       return new Promise((resolve) => resolve({
//         "fileId": "598821f949c0a938d57563bd",
//         "name": "file1.jpg",
//         "url": "https://ik.imagekit.io/your_imagekit_id/images/products/file1.jpg"
//       }));
//     }
//   };
// });

// const imagekit = require('imagekit');
// console.log(imagekit, "-=-=-=-=-=-=-=-=-=-=");

const mutation = {
  query: `
      mutation Mutation($images: [Upload!]!) {
      uploadImages(images: $images) {
        msg
      }
    }
  `,
  variables: {
    images: [null]
  }
};

describe('e2e demo', () => {
  let server, url;

  // beforeAll(() => {
  //   jest.mock('../helpers/imageUpload.mjs', () => {
  //     const imagekit = {
  //       upload: () => {
  //         return new Promise(resolve => resolve('test.png'));
  //       }
  //     };
  //     return imagekit;
  //   });
  // });
  // before the tests we spin up a new Apollo Server
  beforeAll(async () => {

    // Note we must wrap our object destructuring in parentheses because we already declared these variables
    // We pass in the port as 0 to let the server pick its own ephemeral port for testing
    try {
      ({ server, url } = await initServer(3000));
      console.log(url, "<---");
    } catch (error) {
      console.log(error);
    }
  });

  // after the tests we'll stop the server
  afterAll(async () => {
    await server?.stop();
  });

  it('upload multi image test', async () => {
    // send our request to the url of the test server
    const response = await supertest(url).post('/')
      .set('apollo-require-preflight', 'true')
      .field('operations', JSON.stringify(mutation))
      .field('map', JSON.stringify({ "0": ["variables.images.0"] }))
      .attach('0', './__test__/assets/test.png');

    console.log(response.body);
    expect(response.errors).toBeUndefined();
    expect(response.body.data).toEqual({ uploadImages: { msg: 'Upload success' } });
  });
});

