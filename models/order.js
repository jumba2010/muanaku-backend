const constants = require("../utils/constants");

const orderSchema = {
  TableName: constants.ORDER_TABLE,
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

module.exports = orderSchema;