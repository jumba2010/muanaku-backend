const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');
 
router.post('/', async (req,res)=>{
  try{
    const resp= await crudService.create(constants.CHIKEN_BATCH_TABLE,req.body)
    res.send(resp)
   }
   catch(err){
     console.log(err)
     res.status(500).json({error:err})
   }
    
});

router.put('/:id', async (req,res)=>{
  try{
    console.log(payload)
    await crudService.update(constants.CHIKEN_BATCH_TABLE,req.params.id,req.body)
    res.status(200).send({message:"Update made successfully"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  } 

});

router.get('sucursal/:sucursalId', async (req,res)=>{
   const response=await crudService.queryBySucursalId(constants.CHIKEN_BATCH_TABLE,req.params.sucursalId,req.query.lastEvaluatedKey,req.query.pageLimit)   
   res.status(200).send(response)
  });

router.get('sucursal/:sucursalId/year/:year/month/:month', async (req,res)=>{
    const response=await crudService.findPaymentsBySucursalAndYearAndMonth(constants.CHIKEN_BATCH_TABLE,req.params.sucursalId,req.params.year,req.params.month)   
    res.status(200).send(response)
  });

module.exports=router;