const DynamoDBTableUtility = require('../utils/DynamoDBTableUtility');
const anomaliesSchema = require('../models/anomalies');
const chickenBatchSchema = require('../models/chickenbatch');
const costSchema = require('../models/cost');
const feedPrevisionSchema = require('../models/feedprevision');
const loginInfonSchema = require('../models/logininfo');
const smsSchema = require('../models/sms');
const sucursalSchema = require('../models/sucursal');
const userSchema = require('../models/user');
const incidentSchema = require('../models/incident');
const orderSchema = require('../models/order');
const priceConfigSchema = require('../models/priceconfig');
const vaccineSchema = require('../models/vaccine');

const anomaliesTableUtility = new DynamoDBTableUtility(anomaliesSchema.TableName, anomaliesSchema);
const chickenBatchTableUtility = new DynamoDBTableUtility( chickenBatchSchema.TableName, chickenBatchSchema);
const costTableUtility = new DynamoDBTableUtility(costSchema.TableName, costSchema);
const feedPrevisionTableUtility = new DynamoDBTableUtility(feedPrevisionSchema.TableName, feedPrevisionSchema);
const logginInfoTableUtility = new DynamoDBTableUtility( loginInfonSchema.TableName, loginInfonSchema);
const smsTableUtility = new DynamoDBTableUtility(smsSchema.TableName, smsSchema);
const sucursalTableUtility = new DynamoDBTableUtility(sucursalSchema.TableName, sucursalSchema);
const userTableUtility = new DynamoDBTableUtility( userSchema.TableName, userSchema);
const incidentTableUtility = new DynamoDBTableUtility(incidentSchema.TableName, incidentSchema);
const orderTableUtility = new DynamoDBTableUtility(orderSchema.TableName, orderSchema);
const priceConfigTableUtility = new DynamoDBTableUtility(priceConfigSchema.TableName, priceConfigSchema);
const vaccineTableUtility = new DynamoDBTableUtility(vaccineSchema.TableName, vaccineSchema);

const update=async () => {
  await anomaliesTableUtility.checkOrCreateTable();
  await chickenBatchTableUtility.checkOrCreateTable();
  await costTableUtility.checkOrCreateTable();
  await feedPrevisionTableUtility.checkOrCreateTable();
  await incidentTableUtility.checkOrCreateTable();
  await logginInfoTableUtility.checkOrCreateTable();
  await smsTableUtility.checkOrCreateTable();
  await sucursalTableUtility.checkOrCreateTable();
  await userTableUtility.checkOrCreateTable();
  await orderTableUtility.checkOrCreateTable();
  await priceConfigTableUtility.checkOrCreateTable();
  await vaccineTableUtility.checkOrCreateTable();
  

}

module.exports = {update};
