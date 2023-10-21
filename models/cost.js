const constants = require("../utils/constants");

const costSchema = {
  TableName: constants.COST_TABLE,
  AttributeDefinitions: [
    { AttributeName: 'id', AttributeType: 'S' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH',
    }
    
  ],
};

module.exports = costSchema;