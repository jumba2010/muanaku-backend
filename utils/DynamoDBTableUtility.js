const { CreateTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const {dynamoDBClient} = require('../config/awsConfig'); 

class DynamoDBTableUtility {
  constructor(tableName, schema) {
    this.tableName = tableName;
    this.schema = schema;
  }

  async createTable() {
    try {
      const command = new CreateTableCommand({
        TableName: this.tableName,
        ...this.schema,
      });

      await dynamoDBClient.send(command);
      console.log(`Table ${this.tableName} created successfully.`);

    } catch (error) {
      console.error(`Error creating table ${this.tableName}:`, error);

    }
  }

  async tableExists() {
    try {
      const command = new DescribeTableCommand({
        TableName: this.tableName,
      });

      await dynamoDBClient.send(command);

      return true;
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        return false;
      }
      throw error;
    }
  }

  async checkOrCreateTable() {
    const exists = await this.tableExists();
    if (!exists) {
      await this.createTable();
    }  else {
        console.log(`Table ${this.tableName} exists`);
    }
  }
}

module.exports = DynamoDBTableUtility;
