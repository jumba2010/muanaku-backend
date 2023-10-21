// const Carier=require('../models2/carier');
// const Payment=require('../models2/payment');
// const Student=require('../models2/student');
// const Registration = require('../models2/registration');
// const crudService=require('../services/crudService');
// const constants=require('../utils/constants');
// const {convertToString} = require('../utils/DatetimeUtils');
// const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');

// const migrateAll = async (sucursalId,sucursalId2) =>{

//   try{
//     var students= await Student.findAll({
//         raw: true, where: { sucursalId: sucursalId }, order: [
//           ['createdAt', 'DESC'],
//         ],})
    
//     for(var i=0;i<students.length;i++){
//          var st=students[i]
         
//          var carier=await  Carier.findOne({ where: { studentId: st.id } })
       
//          st.carier = carier;
       
//          st.createdAt= convertToString(new Date(st.createdAt));
//          st.updatedAt= convertToString(new Date(st.updatedAt));
//          st.activationDate= convertToString(new Date(st.activationDate));

//          st.sucursalId=sucursalId2;

//          const modifiedObject = JSON.parse(JSON.stringify(st));
//          delete modifiedObject.carier.createdAt;
//          delete modifiedObject.carier.updatedAt;
//          if (modifiedObject.carier) {
//             delete modifiedObject.carier.createdAt;
//             delete modifiedObject.carier.updatedAt;
//             delete modifiedObject.carier.activationDate;
//             delete modifiedObject.studentId;
//           }

//          let student = await  crudService.create(constants.STUDENT_TABLE,modifiedObject);
//          console.log('student created',student.id)
         
//          let registrations = await  Registration.findAll({
//             raw: true, where: { student_id: st.id }
//           });

//           for (let index = 0; index < registrations.length; index++) {
//             const registration = registrations[index];

//           registration.createdAt= convertToString(new Date(registration.createdAt));
//           registration.updatedAt= convertToString(new Date(registration.updatedAt));
//           registration.activationDate= convertToString(new Date(registration.activationDate));
//           registration.studentId=student.id;
//           registration.sucursalId=sucursalId2;
//           registration.student = student;

//          let payments = await   Payment.findAll({raw: true,where:{registrationId:registration.id}, order: [
//           ['year', 'ASC'], ['month', 'ASC']
//       ],})


//         let newPayments = []
//         for (let index = 0; index < payments.length; index++) {
//             const payment = payments[index];
//             payment.createdAt= convertToString(new Date(payment.createdAt));
//             payment.updatedAt= convertToString(new Date(payment.updatedAt));
//             payment.activationDate= convertToString(new Date(payment.activationDate));
//             payment.paymentDate= convertToString(new Date(payment.paymentDate));
//             payment.sucursalId=sucursalId2;
//             payment.studentId=student.id;
//             newPayments.push(payment);
//         }


//         registration.payments = newPayments;
//         let createdRegistration= await  crudService.create(constants.REGISTRATION_TABLE,registration);
//         console.log('Registration created ',createdRegistration.id)

//         for (let index = 0; index < newPayments.length; index++) {
//           const payment = newPayments[index];
//           payment.student=student;
//           payment.student.carier=null;
//           payment.studentId=student.id
//           payment.registrationId = createdRegistration.id;
//           let createdPayment = await  crudService.create(constants.PAYMENT_TABLE,payment);
//           console.log('Payment created ',createdPayment.id);
//       }

//          } 
//       }
//         }
//         catch(err){
//           console.log('Error Occured: ',err)
//         }
// }


// const migrate = async () => {
//     await migrateAll(1, '37ca4579-0471-4ae6-a0b0-92242807b002');
//     //await migrateAll(2, 'e0370620-c552-40aa-9e5a-2190725dc03e');
//     console.log('All data syncronized successfully!')


// } 


// module.exports = {migrate}

