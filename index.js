const express = require('express');
const user = require('./routes/user');
const auth = require('./routes/auth');
const anomalies = require('./routes/anomalies');
const chickenbatch = require('./routes/chikenbatch');
const sucursal = require('./routes/sucursal');
const cost = require('./routes/cost');
const incident = require('./routes/incident');
const order = require('./routes/order');
const logininfo = require('./routes/logininfo');
const profile = require('./routes/profile');
const priceconfig = require('./routes/priceconfig');
const sms = require('./routes/sms');

const DynamoDBSchemaUpdater =require("./services/DynamoDBSchemaUpdater");

const serverless = require('serverless-http');

const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();
var server = require('http').createServer(app);


app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

app.use('/api/v1/user', user);
app.use('/api/v1/auth', auth);
app.use('/api/v1/logininfo', logininfo);
app.use('/api/v1/sucursal', sucursal);
app.use('/api/v1/profile', profile);
app.use('/api/v1/anomalies', anomalies);
app.use('/api/v1/chickenbatch', chickenbatch);
app.use('/api/v1/cost', cost);
app.use('/api/v1/incident', incident);
app.use('/api/v1/order', order);
app.use('/api/v1/priceconfig', priceconfig);
app.use('/api/v1/sms', sms);


dotenv.config();
DynamoDBSchemaUpdater.update();


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


const PORT = process.env.PORT || 3333
server.listen(PORT, '127.0.0.1',() => {
console.log(`server running on port ${PORT}`);

}
) ;
// module.exports.handler = serverless(app);

