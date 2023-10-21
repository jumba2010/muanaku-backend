const express=require('express');
const router=express.Router();

const crudService=require('../services/crudService');
const constants=require('../utils/constants');
 
router.post('/', async (req,res)=>{
  try{
    const resp= await crudService.create(constants.FREQUENCY_TABLE,req.body)
    res.send(resp)
   }
   catch(err){
     console.log(err)
     res.status(500).json({error:err})
   }
});

router.put('/:id', async (req,res)=>{
  try{
    await crudService.update(constants.FREQUENCY_TABLE,req.params.id,req.body)
    res.status(200).send({message:"Updated Successfully!"})
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  } 
});

router.get('/:sucursalId', async (req,res)=>{
const response=await crudService.queryBySucursalId(constants.FREQUENCY_TABLE,req.params.sucursalId)   
res.status(200).send(response)
});


module.exports=router;