const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');

router.post('/', async (req,res)=>{
  try{
   const resp= await crudService.create(constants.LOGININFO_TABLE,req.body)
   res.send(resp)
  }
  catch(err){
    console.log(err)
    res.status(500).json({error:err})
  }
});

router.get('/:userId', async (req,res)=>{
  //TODO: Implement logic to find the logininfo
  res.send([{
    date:"2023-12-12 18:22:18"
  }])
});

module.exports=router;