const opencage = require('../');

describe('OpenCage Lib suite', () => {
  test('library exists', () => {
    expect(opencage).toBeTruthy();
    expect(typeof opencage).toBe('object');
  });

  beforeAll(() => {
    jest.mock('opencage-api-client');
  });
  afterAll(() => {
    jest.unmock('opencage-api-client');
  });

  let response;

  beforeEach(() => {
    response = {
      statusCode: 0,
      body: {},
      status: jest.fn(code => {
        response.statusCode = code;
        return {
          send: jest.fn(body => {
            response.body = body;
            return true;
          }),
        };
      }),
    };
  });

  describe('Rainy Tests', () => {
    describe('#Query String', () => {
      test('no query parameters', async done => {
        const request = {};

        try {
          await opencage.geocode(request, response);
          expect(response.body).toEqual(opencage.ERROR_QUERY_PARAMETERS);
        } catch (err) {
          expect(false).toBeTruthy();
        } finally {
          done();
        }
      });

      test('no queryStringParameters', async done => {
        const request = {
          query: {},
        };

        try {
          await opencage.geocode(request, response);
          expect(response.body).toEqual(opencage.ERROR_QUERY_PARAMETERS);
        } catch (err) {
          expect(false).toBeTruthy();
        } finally {
          done();
        }
      });

      test('rejection', async done => {
        const request = {
          query: { q: 'networkerror' },
        };

        try {
          await opencage.geocode(request, response);
          expect(response.body).toBeTruthy();
        } catch (err) {
          expect(false).toBeTruthy();
        } finally {
          done();
        }
      });
    });

    describe('#Environment', () => {
      let backup;

      beforeAll(() => {
        backup = process.env.OCD_API_KEY;
        delete process.env.OCD_API_KEY;
      });

      afterAll(() => {
        process.env.OCD_API_KEY = backup;
      });

      test('no env var', async done => {
        const request = {
          query: { q: 'Brandenburg Gate' },
        };

        try {
          await opencage.geocode(request, response);
          expect(response.body).toEqual(opencage.MISSING_API_KEY);
        } catch (err) {
          expect(false).toBeTruthy();
        } finally {
          done();
        }
      });
    });
  });

  describe('Mocked Tests', () => {
    test('geocode `Brandenburg Gate`', async done => {
      const request = {
        query: { q: 'Brandenburg Gate' },
      };

      try {
        await opencage.geocode(request, response);
        // console.dir(response.body);
        expect(response.body).toBeTruthy();
      } catch (err) {
        expect(false).toBeTruthy();
      } finally {
        done();
      }
    });
    test('reverse geocode `Brandenburg Gate`', async done => {
      const request = {
        query: { q: '52.5162767 13.3777025' },
      };

      try {
        await opencage.geocode(request, response);
        // console.dir(response.body);
        expect(response.body).toBeTruthy();
      } catch (err) {
        expect(false).toBeTruthy();
      } finally {
        done();
      }
    });
  });
});
