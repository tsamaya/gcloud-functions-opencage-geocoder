require('dotenv').config();
const opencage = require('opencage-api-client');

exports.geocode = (request, response) => {
  if (!request.query) {
    response.status(400).send({error: 400, message: "Couldn't read query parameters"});
    return;
  }

  if (typeof process.env.OCD_API_KEY === 'undefined') {
    response.status(403).send({error: 403, message: 'missing API key'});
    return;
  }
  const query = request.query;
  query.key = process.env.OCD_API_KEY;
  opencage.geocode(query).then(data => {
    response.status(200).send(data);
  }).catch(err => {
    response.status(400).send({error: 400, message: err.statusText});
  });
};
