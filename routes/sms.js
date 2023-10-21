const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');
 
router.post('/', async (req,res)=>{
  try{
    await crudService.update(constants.SMS_TABLE,req.body)
    res.status(200).send({message:"Update made successfully"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  } 

});

router.get('sucursal/:sucursalId', async (req,res)=>{
   const response=await crudService.queryBySucursalId(constants.SMS_TABLE,req.params.sucursalId,req.query.lastEvaluatedKey,req.query.pageLimit)   
   res.status(200).send(response)
  });


module.exports=router;