const express = require('express');
const router = express.Router();
const crudService=require('../services/crudService');
const constants=require('../utils/constants');
const {convertToStringDate} = require('../utils/DatetimeUtils');

router.post('/', async (req, res) => {
  try{
   const   { name, sex, alergicToFood, alergicToMedicine, wasTransfered, oldSchool, 
      studentAddress, birthDate, docType, docNumber, motherContact, fatherContact,
       motherName, fatherName, picture, currentMonthlyPayment, level, sucursalId, 
       sucursal, createdBy, activatedBy,carier } = req.body;

    const studentPayload =  {sucursalId:sucursal.id,  name,carier, address: studentAddress, alergicToFood, wasTransfered, oldSchool, alergicToMedicine, sex, birthDate, docType, docNumber, motherContact, fatherContact, motherName, fatherName, picture, currentMonthlyPayment, level, sucursalId, createdBy, activatedBy }
    studentPayload.birthDate =convertToStringDate(new Date(birthDate));
    const resp= await crudService.create(constants.STUDENT_TABLE,studentPayload)
    res.send(resp)
   }
   catch(err){
     console.log(err)
     res.status(500).json({error:err})
   }
    
});

router.put('/:id', async (req, res) => {

    const studentPayload = { name, alergicToFood, alergicToMedicine,
      carierId,
      registrationId, oldSchool, address, sex,
      birthDate, docType, docNumber,
      motherName, fatherName, picture,
      motherContact, fatherContact,
      totalPaid, monthlyPayment, payments,
      carierName, kinshipDegree, contact, carierDocType, carierDocNumber, workPlace,
      discount, isNew, needSpecialTime, classId,
      currentMonthlyPayment, level, updatedBy } = req.body;

      studentPayload.carier= { name: carierName, kinshipDegree, syncStatus: 1, contact, docType: carierDocType, docNumber: carierDocNumber, workPlace, updatedBy };
      const registrationPayload =  { totalPaid, monthlyPayment, syncStatus: 1, discount, isNew, needSpecialTime, classId, updatedBy };

      let reg = await crudService.update(constants.REGISTRATION_TABLE,registrationId,registrationPayload);

      try{
        
        //Update all unpaid payments
        for (let i = 0; i < payments.length; i++) {
          if (payments[i].status === 0) {
            const paymentPayload= { total: monthlyPayment, discount, syncStatus: 1, updatedBy };
            await crudService.update(constants.PAYMENT_TABLE, payments[i].id,paymentPayload)  
          }
        }

        let newPayments = await crudService.findCurrentByStudentId(constants.PAYMENT_TABLE,req.params.id,reg.sucursalId);

        studentPayload.payments=newPayments;
        const resp = await crudService.update(constants.STUDENT_TABLE,req.params.id,studentPayload);
       
        res.send(resp)
       }
       catch(err){
         console.log(err)
         res.status(500).json({error:err})
       }
});

router.put('/inativate/:id', async (req, res) => {
  const { payments, registrationId, carierId, activatedBy } = req.body;
  await crudService.inactivate(constants.STUDENT_TABLE,req.params.id);
  await crudService.inactivate(constants.REGISTRATION_TABLE,registrationId);
 
  //inactivate each payment
  for (let i = 0; i < payments.length; i++) {
    await crudService.inactivate(constants.PAYMENT_TABLE,payments[i].id );
  }
});




router.get('/unrenewd/sucursal/:sucursalId', async (req, res) => {
  let year = new Date().getFullYear();

  let students = await crudService.queryBySucursalId(constants.STUDENT_TABLE, req.params.sucursalId);
  let registrations = await crudService.queryBySucursalIdAnYear(constants.REGISTRATION_TABLE, req.params.sucursalId, year);
  
  // Create a list of studentIds from the registrations list
  const registeredStudentIds = registrations.map(registration => registration.studentId);
  
  // Filter students to include only those who are not in the registrations list
  const unregisteredStudents = students.filter(student => !registeredStudentIds.includes(student.studentId));
 
  return res.send(unregisteredStudents);
});


router.get('/history/sucursal/:sucursalId', async (req, res) => {
  let newList = []
  
  let students = await crudService.queryBySucursalId(constants.STUDENT_TABLE,req.params.sucursalId);

  for(var i=0;i<students.length;i++){
     let st=students[i]
     let registrations =  await crudService.findCurrentByStudentId(constants.REGISTRATION_TABLE,st.id,req.params.sucursalId);
     registrations.forEach(async reg=>{
     let payments= await crudService.findPaymentsByRegistrationId(reg.id,req.params.sucursalId);
     reg.payments=payments
     })
     st.registrations = registrations;
     newList.push(st)

     if(i==students.length-1){
      res.send(newList);
     }
      
    }
});


module.exports = router;