const express = require("express");
const router = express.Router();
const {checkKey,checkFields} = require("../tools/exports");
const {Tags} = require('../models/tags');
const {URLCAD,USERKC,USERPC,EMAIL,EP,SENDEMAIL} = require('../config');
const {GetData,SendMail} = require('../classes/exports');

router.post('/copy',checkKey,checkFields,(req,res) => {
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	const email = new SendMail(EMAIL,EP);
	return getData.getData([],1)

	.then(data => {
		return res.json({
			status:200,
			data
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