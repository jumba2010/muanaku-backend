const DynamoDBTableUtility = require('../utils/DynamoDBTableUtility');
const paymentSchema = require('../models/payment');
const registrationSchema = require('../models/registration');
const studentSchema = require('../models/student');
const frequencytSchema = require('../models/frequency');
const loginInfonSchema = require('../models/logininfo');
const smsSchema = require('../models/sms');
const sucursalSchema = require('../models/sucursal');
const userSchema = require('../models/user');
const paymentConfigSchema = require('../models/paymentconfig');
const profileSchema = require('../models/profile');

const paymentTableUtility = new DynamoDBTableUtility(paymentSchema.TableName, paymentSchema);
const registrationTableUtility = new DynamoDBTableUtility( registrationSchema.TableName, registrationSchema);
const studentTableUtility = new DynamoDBTableUtility(studentSchema.TableName, studentSchema);
const frequencyTableUtility = new DynamoDBTableUtility(frequencytSchema.TableName, frequencytSchema);
const logginInfoTableUtility = new DynamoDBTableUtility( loginInfonSchema.TableName, loginInfonSchema);
const smsTableUtility = new DynamoDBTableUtility(smsSchema.TableName, smsSchema);
const sucursalTableUtility = new DynamoDBTableUtility(sucursalSchema.TableName, sucursalSchema);
const userTableUtility = new DynamoDBTableUtility( userSchema.TableName, userSchema);
const paymentConfigTableUtility = new DynamoDBTableUtility(paymentConfigSchema.TableName, paymentConfigSchema);
const profileTableUtility = new DynamoDBTableUtility(profileSchema.TableName, profileSchema);

const update=async () => {
  await paymentTableUtility.checkOrCreateTable();
  await registrationTableUtility.checkOrCreateTable();
  await studentTableUtility.checkOrCreateTable();
  await frequencyTableUtility.checkOrCreateTable();
  await frequencyTableUtility.checkOrCreateTable();
  await logginInfoTableUtility.checkOrCreateTable();
  await smsTableUtility.checkOrCreateTable();
  await sucursalTableUtility.checkOrCreateTable();
  await userTableUtility.checkOrCreateTable();
  await paymentConfigTableUtility.checkOrCreateTable();
  await profileTableUtility.checkOrCreateTable();

}

module.exports = {update};
