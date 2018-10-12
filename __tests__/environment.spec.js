const dotenv = require('dotenv');

dotenv.config();

describe('Environment VARs suite', () => {
  if (process.env.CI) {
    // skip this test on CI,
    //    then eslint disable line to prevent jest/no-disabled-tests
    // eslint-disable-next-line
    test.skip('CI : skipping integration tests', () => {});
    return;
  }
  test('OCD_API_KEY exisits', () => {
    expect(process.env.OCD_API_KEY).toBeTruthy();
  });
});
