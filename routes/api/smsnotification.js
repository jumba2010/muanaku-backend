const express = require('express');
const router = express.Router();
var http = require("https");
const crudService=require('../../services/crudService');
const constants=require('../../utils/constants');
require('dotenv').config()


router.post('/carrier', async (req,res)=>{
    const {message,idContactPairs,sucursalId}=req.body; 
    let configurations = await crudService.queryBySucursalId(constants.PAYMENTCONFIG_TABLE,sucursalId);
    let configuration=configurations[0]

    for (let index = 0; index < idContactPairs.length; index++) {
        await sendNotification('258' + idContactPairs[index].contact,message , configuration.smsSenderID,idContactPairs[index].id,sucursalId);
    }

    res.status(200).send({message:"Message Sent"})
});

router.get('/sucursal/:sucursalId', async (req,res)=>{
   let  sentmessages = await crudService.queryBySucursalId(constants.SMS_TABLE,req.params.sucursalId);
    res.send(sentmessages)
    });


async function sendNotification(cellphone, message, senderId,studentId,sucursalId,studentName) {
    let stringfyedMessage=encodeURI(message); 
    var options = {
        "method": "GET",
        "hostname": "world.msg91.com",
        "port": 443,
        "path": `/api/sendhttp.php?mobiles=${cellphone}&authkey=${process.env.MSG_91_AUTH_KEY}&unicode=1&route=4&sender=${senderId}&message=${stringfyedMessage}`,
        "headers": {}
    };

    var req = http.request(options, async function (res) {
        var chunks = [];

        res.on("data", function (chunk) {
            chunks.push(chunk);
        });

        res.on("end", async function () {
            var body = Buffer.concat(chunks);
            let requestId=body.toString();
            let payload = {sucursalId,studentId,requestId,message,senderId,number:cellphone, studentName}
          await crudService.create(constants.SMS_TABLE,payload)

                console.log('Message successfully sent ',requestId);
        });
    });

    req.end();

}

module.exports = router;