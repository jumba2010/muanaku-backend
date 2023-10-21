const AWS = require('../../../config/awsConfig');

const dynamoDB = new AWS.DynamoDB.DocumentClient();

module.exports = dynamoDB;
