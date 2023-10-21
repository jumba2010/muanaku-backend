const { marshall } = require("@aws-sdk/util-dynamodb");

const composeUdateFields = (payload) => {
  let expressionAttributeNames={}
  let expressionAttributeValues={};
  let updateExpression="";
  
  for (const key in payload) {
    let expression=':'+key;
    let expressionEscape='#'+key;
    let value=payload[key];
    let valueType=getValueType(value);

    /*When Sending Data as Number to DynamoDB whe need to send them in String formated way like in the example below:
    Ex. {
    ':model': { S: 'KML5' },  // String attribute
    ':rating': { N: '4.5' }   // Number attribute (represented as a string)
    */
    if(valueType=='N')value=''+value

    //For any other DataTypes, We need to send them in a formated way
    if(valueType=='M' || valueType=='L' ) value=marshall(value)

    expressionAttributeValues[expression] = {
        [valueType]: value,
    };
    expressionAttributeNames[expressionEscape]=key;
  
    if(updateExpression==""){
        updateExpression='SET #' +key+ ' = '+expression
    }
    else{
        updateExpression=updateExpression+',#'+key+' = '+expression
    }
  
  }
  
  return {expressionAttributeNames,expressionAttributeValues,updateExpression}
  }
  
  const  getValueType = (value) => {
    if (Array.isArray(value)) {
      return 'L';//List
    } else if (typeof value === 'number' && isFinite(value)) {
      return 'N'; // Number
    } else if (typeof value === 'string' || value instanceof String ||
    typeof value === 'date' || value instanceof Date || value instanceof Boolean) {
      return 'S'; // String
    } 
    else if (typeof value === 'object' && value !== null) {
      return 'M'; // Object (Map)
    } else {
      return 'UNKNOWN'; // Unknown type
    }
  }


  const  flattenAttributes = (obj) => {

    if (Array.isArray(obj)) {
      // If the input is an array, iterate through it and recursively flatten each element.
      return obj.map((item) => flattenAttributes(item));
    }
    
    const flattenedObj = {};
  
    for (const key in obj) {
      if (typeof obj[key] === "object") {
        if (Object.keys(obj[key])[0] === "M") {
          // For nested objects (Map), recursively flatten them
          flattenedObj[key] = flattenAttributes(obj[key]["M"]);
        } else if (Object.keys(obj[key])[0] === "L") {
          // For lists (List), iterate through and flatten each element
          flattenedObj[key] = obj[key]["L"].map((item) => flattenAttributes(item["M"]));
        } else {
          // For other data types (e.g., String, Number), extract the value
          flattenedObj[key] = obj[key][Object.keys(obj[key])[0]];
        }
      } else {
        // For scalar values, directly assign the value
        flattenedObj[key] = obj[key];
      }
    }
  
    return flattenedObj;
  }
  

  module.exports={
    composeUdateFields,
    flattenAttributes
  }