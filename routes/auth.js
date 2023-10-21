const jwt=require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const Joi = require('joi');
const express=require('express');
const router=express.Router();

const crudService=require('../services/crudService');
const constants=require('../utils/constants');

router.post('/', async (req,res)=>{   
    const { password, userName } = req.body;

    let user=await crudService.findActiveByUserName(constants.USER_TABLE,userName); 
    if(!user) return res.status(400).send('Invalid username or  password');
      const validPassword = await bcrypt.compareSync(password,user.password);
   if(!validPassword) return res.status(400).send('Invalid username or  password');
      const token=await jwt.sign({_id:user._id,username:user.username,profile:user.profile,transactions:user.transactions,name:user.name,email:user.email},process.env.JWT_PRIVATE_KEY);
      res.send(token); 
    });

module.exports=router;