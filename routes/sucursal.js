const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');

router.get('/', async (req,res)=>{  
  res.send(200);
});


module.exports=router;