require('dotenv').config();
const opencage = require('opencage-api-client');

const MISSING_API_KEY = { error: 403, message: 'missing API key' };
const ERROR_QUERY_PARAMETERS = {
  error: 400,
  message: "Couldn't read query parameters",
};

exports.MISSING_API_KEY = MISSING_API_KEY;
exports.ERROR_QUERY_PARAMETERS = ERROR_QUERY_PARAMETERS;

/**
 * geocode using opencage geocoder API
 *
 * @param  {Object} request  http request, same as opencage API [see](https://opencagedata.com/api), exception API key
 * @param  {Object} response opencage geocoder API response
 */
exports.geocode = (request, response) => {
  if (!request.query || !request.query.q) {
    // console.log('!request.query');
    response.status(400).send(ERROR_QUERY_PARAMETERS);
    return;
  }
  if (
    typeof process.env.OCD_API_KEY === 'undefined' &&
    typeof request.query.key === 'undefined'
  ) {
    // console.log('no key');
    response.status(403).send(MISSING_API_KEY);
    return;
  }
  const { query } = request;
  query.key = process.env.OCD_API_KEY;
  // console.log('processing');
  opencage
    .geocode(query)
    .then(data => {
      // console.dir('200', data);
      response.status(200).send(data);
    })
    .catch(err => {
      // console.dir('400', err);
      response.status(400).send({ error: 400, message: err.statusText });
    });
};
