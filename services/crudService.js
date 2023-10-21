const { dynamoDBClient } = require('../config/awsConfig');

const constants=require('../utils/constants');
const {
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
} = require('@aws-sdk/client-dynamodb');

const { marshall } = require('@aws-sdk/util-dynamodb');
const { v4: uuidv4 } = require('uuid');
const {composeUdateFields,flattenAttributes}=require('../utils/DynamoDBUpdaterUtil');
const {getCurrentDateTime}=require('../utils/DatetimeUtils');


const create = async (tableName,payload) => {
  
  try {
    payload.id = await uuidv4();
    payload.active = 1;
    payload.createdAt = getCurrentDateTime();

    let newPayload =removeEmpty(payload)

    const params = {
      TableName:tableName,
      Item: marshall(newPayload),
    };
    
    const command = new PutItemCommand(params);
    await dynamoDBClient.send(command);
    return payload;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const update = async (tableName,id, payload) => {
  payload.updatedAt = getCurrentDateTime();
  let fieldsToUpdate=composeUdateFields(payload);
  
    try {
      const input = {
        ExpressionAttributeNames:fieldsToUpdate.expressionAttributeNames,
        ExpressionAttributeValues: fieldsToUpdate.expressionAttributeValues,
        Key: {
          "id": {
            S: id
          }
        },
        ReturnValues: "ALL_NEW",
        TableName: tableName,
        UpdateExpression:fieldsToUpdate.updateExpression,
      };
  
      const command = new UpdateItemCommand(input);
      await dynamoDBClient.send(command);
  
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  
  const deleteRow = async (tableName,id) => {
    try {
      const params = {
        TableName:tableName,
        Key: marshall({ id: id }),
      };
  
      const command = new DeleteItemCommand(params);
      await dynamoDBClient.send(command);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  const inactivate = async (tableName,id) => {
    try {
      const params = {
        TableName:tableName,
        Key: {
          id,
        },
        UpdateExpression: 'SET #active = :active',
        ExpressionAttributeNames: {
          '#active': 'active',
        },
        ExpressionAttributeValues: {
          ':active': false, 
        },
      };
  
      const command = new UpdateItemCommand(params);
      await dynamoDBClient.send(command);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


  const readById = async (tableName,id) => {

    try {
      const params = {
        TableName: tableName,
        Key: marshall({ id: id }),
      };
  
      const command = new GetItemCommand(params);
      const response = await dynamoDBClient.send(command);
  
      if (!response.Item) {
        throw new Error('not_found',`${tableName} was not found by id ${id}`);
      }
  
      return flattenAttributes(response.Item);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
  
  
  const findActiveByUserName = async (tableName,username) => {
    try {
      const command = new QueryCommand({
        IndexName: 'sge-username-index', 
        KeyConditionExpression: "username = :username",
        FilterExpression: "#active = :active",
        ExpressionAttributeNames: {
          '#active': 'active',
        },
        ExpressionAttributeValues: {
          ":username": { S: username },
          ":active": { N: "1" }
        },
        TableName: tableName,
      });
      
      const response = await dynamoDBClient.send(command);
      return flattenAttributes(response.Items[0]);
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  };


const queryBySucursalId= async (tableName, sucursalId, lastEvaluatedKey, pageLimit) => {
  const data = []

  let done = false;

  while (!done) {
    try {
      const command = new QueryCommand({
        IndexName: 'sucursalId-index',
        KeyConditionExpression: "sucursalId = :sucursalId",
        ExpressionAttributeValues: {
          ":sucursalId": { S: sucursalId }
        },
        TableName: tableName,
        ExclusiveStartKey: lastEvaluatedKey,
        Limit: pageLimit,
        ScanIndexForward: false, // Set to false for descending order
      });

      const response = await dynamoDBClient.send(command);

      if (response.Items) {
        data.push(...flattenAttributes(response.Items));
      }

      lastEvaluatedKey = response.LastEvaluatedKey;

      if (!lastEvaluatedKey) {
        done = true; // No more pages
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return { data, lastEvaluatedKey };
};


const findPaymentsBySucursalAndYearAndMonth = async (tableName,sucursalId,year,month) => {

  if(!tableName || !sucursalId || !year || !month){
    return []
  }

  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: "sucursalId = :sucursalId",
      ExpressionAttributeNames: {
        '#year': 'year',
        '#month': 'month',
      },
      FilterExpression: "#year = :year and #month = :month",
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":year": { N: year.toString() },
        ":month": { N: month.toString() }
      },
      TableName: tableName,
      ScanIndexForward: false
    });

    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const queryBySucursalIdAndStatusAndYear = async (tableName,sucursalId,status,year) => {
  if(!tableName || !sucursalId || !year || !status){
    return []
  }
  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: "sucursalId = :sucursalId",
      FilterExpression: "#year = :year AND #status = :status",
      ExpressionAttributeNames: {
        '#year': 'year',
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":year": { N: year.toString() },
        ":status": { N: status.toString()}
      },
      TableName: tableName,
      ScanIndexForward: false
    });
  
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const findBySucursalAndBatchId = async (tableName,sucursalId,batchId) => {
  if(!tableName || !sucursalId || !batchId ){
    return []
  }
  
  try {
    const command = new QueryCommand({
      IndexName: 'sucursalId-index',
      KeyConditionExpression: ",sucursalId = :sucursalId",
      FilterExpression: "#batchId = :batchId",
      ExpressionAttributeNames: {
        '#batchId': 'batchId',
      },
      ExpressionAttributeValues: {
        ":sucursalId": { S: sucursalId },
        ":batchId": { S: batchId }
      },
      TableName: tableName,
      ScanIndexForward: false
    });
  
    const response = await dynamoDBClient.send(command);
    return flattenAttributes(response.Items)
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const removeEmpty = (obj) => {
  let newObj = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeEmpty(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};

module.exports = { 
  create, 
  update, 
  deleteRow, 
  inactivate,
  readById,
  queryBySucursalId,
  findPaymentsBySucursalAndYearAndMonth,
  findActiveByUserName,
  queryBySucursalIdAndStatusAndYear,
  findBySucursalAndBatchId,
 };
