const nock = require('nock');
const axios = require('axios');
const {checkUrl, execute} = require('./lib/index.js');

axios.defaults.adapter = 'http';

const URL = 'http://example.com';
const TEXT = 'Hello World!';

afterEach(() => {
  nock.cleanAll();
});

describe('found text', () => {

  test('found text at first try', async () => {
    nock(URL).get('/').once().reply(200, TEXT);

    const result = await checkUrl(URL, TEXT);

    expect(result).toBe(true);
  });

  test('found text at second try', async () => {
    nock(URL).get('/').once().reply(200, 'Empty');
    nock(URL).get('/').twice().reply(200, TEXT);

    await checkUrl(URL, TEXT);
    const result = await checkUrl(URL, TEXT);

    expect(result).toBe(true);
  });

});

describe('not found text', () => {

  test('not found text', async () => {
    nock(URL).persist().get('/').reply(200, 'Empty');

    const result = await execute(URL, TEXT, 3, 1);

    expect(result).toBe(false);
  });

});
