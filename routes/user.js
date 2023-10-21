const bcrypt = require('bcryptjs');
const _ = require('lodash');
const express=require('express');
const router=express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');

router.post('/', async (req,res)=>{   
    const {name,email,contact,address,profile,sucursals,username,activatedBy,createdBy,sucursalId}=req.body;
    const salt=await bcrypt.genSaltSync(10);
    try{
      let newpassword=await bcrypt.hashSync(username,salt);
      let userPayload = {sucursals,name,email,contact,address,profile,username, password: newpassword,activatedBy,createdBy,profile,sucursalId}; 
      let user = await crudService.create(constants.USER_TABLE,userPayload);
    
      res.send(_.pick(user,['id','username','active']));
    }
    catch(err){
      console.log(err);
      res.status(500).send({error:err})
    }
   
});

router.put('/password/:id', async (req,res)=>{   
    var {password,updatedBy}=req.body;
    const salt=await bcrypt.genSalt(10);
    try{
      password= await bcrypt.hash(password,salt);
      let payload =  { password,updatedBy };
      let user = await crudService.update(constants.USER_TABLE,req.params.id,payload);
      res.send(user)
    }
    catch(err){
      console.log(err)  
      res.status(500).send({error:err})
    }
    
});

router.put('/inactivate/:id', async (req,res)=>{   
  var {updatedBy}=req.body;
  try{
    let payload =  { updatedBy,active:false };
    let user = await crudService.update(constants.USER_TABLE,req.params.id,payload);
    res.send(user)
  }
  catch(err){
    console.log(err)  
    res.status(500).send({error:err})
  } 
 
});

router.put('/activate/:id', async (req,res)=>{   
  var {updatedBy}=req.body;
  try{
    let payload =  { updatedBy,active:true };
    let user = await crudService.update(constants.USER_TABLE,req.params.id,payload);
    res.send(user)
  }
  catch(err){
    console.log(err)  
    res.status(500).send({error:err})
  } 
 
});

router.put('/:id', async (req,res)=>{   
  var {name,email,contact,address,picture,profileid,updatedBy}=req.body; 
  const payload={ name,email,contact,address,picture,profileid,updatedBy }

 try{
    let user = await crudService.update(constants.USER_TABLE,req.params.id,payload);
    res.send(user)
  }
  catch(err){
    console.log(err)  
    res.status(500).send({error:err})
  }      

});


router.get('/all/:sucursalId', async (req,res)=>{
  let users = await crudService.queryBySucursalId(constants.USER_TABLE,req.params.sucursalId);

   res.send(users);
    });

    router.get('/unique/:userName', async (req,res)=>{       
      let user = await crudService.findActiveByUserName(constants.USER_TABLE,req.params.userName);
      user.password=null;
      res.send(user)
        
    });

    

module.exports=router;