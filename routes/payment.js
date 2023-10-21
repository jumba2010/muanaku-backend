const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');
 
router.post('/', async (req,res)=>{
  try{
    const paymentPayload = {total,discount,studentId,limitDate,sucursal,year,registrationId,createdBy,month,sucursalCode,activatedBy}=req.body;
    const resp= await crudService.create(constants.PAYMENT_TABLE,paymentPayload)
    res.send(resp)
   }
   catch(err){
     console.log(err)
     res.status(500).json({error:err})
   }
    
});



router.put('/pay/:id', async (req,res)=>{
  const {updatedBy,receiptNumber,paymentMethod,payments,registrationId}=req.body;  
  const payload={status:1,paymentMethod,code:receiptNumber,paymentDate:Date.now(),updatedBy}


  try{
    console.log(payload)
    await crudService.update(constants.PAYMENT_TABLE,req.params.id,payload)

    

    const updatedPayments = payments.map((payment) => {
      if (payment.id === req.params.id) {
        return { ...payment, status: 1 };
      }
      return payment;
    });

    let paymentsPayload= {payments:updatedPayments}

    console.log('registrationId',paymentsPayload)
    await crudService.update(constants.REGISTRATION_TABLE,registrationId,paymentsPayload);
    res.status(200).send({message:"Payment made successfully"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  } 

});


router.put('/anull/:id', async (req,res)=>{
  const {updatedBy,studentId}=req.body;  
  const payload={status:0,updatedBy}
  try{
    await crudService.update(constants.PAYMENT_TABLE,req.params.id,payload)
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  } 
});


  router.get('/unpaid/:sucursalId', async (req,res)=>{   
    const response=await crudService.queryUnpaidBySucursalId(constants.PAYMENT_TABLE,req.params.sucursalId)   
    console.log('Updaid',response)
    res.status(200).send(response);
    });

    router.get('/paid/:sucursalId/:year', async (req,res)=>{
      const response=await crudService.queryBySucursalIdAndStatusAndYear(constants.PAYMENT_TABLE,req.params.sucursalId,1,req.params.year)   
      res.status(200).send(response);         
      
        });


module.exports=router;