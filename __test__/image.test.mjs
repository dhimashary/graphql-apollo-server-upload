// import test from "./assets/test.png";
import 'dotenv/config';
import initServer from '../config/server.mjs';
import supertest from 'supertest';
import { jest } from '@jest/globals';

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

