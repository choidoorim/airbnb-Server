const nodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: 'AIzaSyAABBZO0m-jR5wY9qu8ErDzlBb_OLlQbRE'
};

const geocoder = nodeGeocoder(options);

module.exports = {
    geocoder
}