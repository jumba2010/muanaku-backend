const { DynamoDBClient} = require('@aws-sdk/client-dynamodb');
const { fromEnv } = require("@aws-sdk/credential-provider-env");
const { S3Client } = require("@aws-sdk/client-s3");

const  { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const { CognitoIdentityProviderClient } =require("@aws-sdk/client-cognito-identity-provider");

const marshallOptions = {
  // Whether to automatically convert empty strings, blobs, and sets to `null`.
  convertEmptyValues: true, // false, by default.
  // Whether to remove undefined values while marshalling.
  removeUndefinedValues: true, // false, by default.
  // Whether to convert typeof object to map attribute.
  convertClassInstanceToMap: true, // false, by default.
};

const unmarshallOptions = {
  // Whether to return numbers as a string instead of converting them to native JavaScript numbers.
  wrapNumbers: false, // false, by default.
};

const translateConfig = { marshallOptions, unmarshallOptions };

const DEFAULT_REGION = "us-east-1";

// Create a DynamoDB client using the specified profile and region
const client = new DynamoDBClient({
  credentials: fromEnv(),
  region: process.env.C_AWS_REGION,
});

const dynamoDBClient = DynamoDBDocument.from(client, translateConfig);

// Create a S3 client using the specified profile and region
const s3Client = new S3Client({ 
  credentials: fromEnv(),
  region: process.env.C_AWS_REGION
});


// Create a S3 client using the specified profile and region
const cognitoClient = new CognitoIdentityProviderClient({ 
  credentials: fromEnv(),
  region: DEFAULT_REGION
});

module.exports={
  dynamoDBClient,
  s3Client,
  cognitoClient
}



