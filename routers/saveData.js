const express = require("express");
const router = express.Router();
const {checkKey,checkFields} = require("../tools/exports");
const {Tags} = require('../models/tags');
const {URLCAD,USERKC,USERPC,EMAIL,EP,SENDEMAIL} = require('../config');
const {GetData,SendMail,SaveDB} = require('../classes/exports');
//fields array of fields passed in post request
router.post('/copy',checkKey,checkFields,(req,res) => {
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	const email = new SendMail(EMAIL,EP);
	return getData.getData([],1)

	.then(data => {
		const halfIndex = Math.round(data.length / 2);
		const halfData1 = data.slice(0,halfIndex);
		const halfData2 = data.slice(halfIndex,data.length);
		//key db key 
		const modelMap = {
			product_id:'id',
			product_title:'title',
			tags:'tags'
		};
		const saveDB = new SaveDB(halfData1,Tags,modelMap);
		const saveDB2 = new SaveDB(halfData2,Tags,modelMap);
		console.log('===========data length',data.length);
		return Promise.all([saveDB.save(0),saveDB2.save(0)])
	})

	.then(data => {
		console.log('done saving',data);
		return email.send('test@email.com',SENDEMAIL,'Copy Data','<b>Done Copying data</b>')
	})

	.then(data => {
		return res.json({
			status:200,
			message:'done saving email sent'
		});
	})

	.catch(err => {
		console.log('error copying data', err);
		return res.json({
			status:500,
			err:'error copying data'
		});
	})
});

module.exports = {router};