const express = require('express');
const user = require('./routes/user');
const auth = require('./routes/auth');
const student = require('./routes/student');
const payment = require('./routes/payment');
const sucursal = require('./routes/sucursal');
const registration = require('./routes/registration');
const frequency = require('./routes/frequency');
const smsntification = require('./routes/api/smsnotification');
const logininfo = require('./routes/logininfo');
const profile = require('./routes/profile');
const Migration = require('./routes/migration');
const DynamoDBSchemaUpdater =require("./services/DynamoDBSchemaUpdater");

const serverless = require('serverless-http');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
//var server = require('http').createServer(app);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use('/api/user', user);
app.use('/api/auth', auth);
app.use('/api/student', student);
app.use('/api/payment', payment);
app.use('/api/sucursal', sucursal);
app.use('/api/registration', registration);
app.use('/api/smsntification', smsntification);
app.use('/api/frequency', frequency);
app.use('/api/logininfo', logininfo);
app.use('/api/profile', profile);


dotenv.config();
//DynamoDBSchemaUpdater.update();
//Migration.migrate();

app.use(logger('dev'));
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);

app.use(
  bodyParser.json()
);
app.use(cookieParser());


// const PORT = process.env.PORT || 3333
// server.listen(PORT, '127.0.0.1',() => {
// console.log(`server running on port ${PORT}`);

// }
// ) ;
module.exports.handler = serverless(app);

