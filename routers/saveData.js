const express = require("express");
const router = express.Router();
const {checkKey,checkFields,checkCollectionId} = require("../tools/exports");
const {Tags} = require('../models/tags');
const {URLCAD,USERKC,USERPC,EMAIL,EP,SENDEMAIL} = require('../config');
const {GetData,SendMail,SaveDB,SaveToShopify,SetTags} = require('../classes/exports');
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
	});
});

//update tags on shopify
router.get('/backup',checkKey,(req,res) => {
	const email = new SendMail(EMAIL,EP);
	return Tags.find({})

	.then(priceData => {
		const convertedData = priceData;
		const halfIndex = Math.round(convertedData.length / 2);
		const halfData1 = convertedData.slice(0,halfIndex);
		const halfData2 = convertedData.slice(halfIndex,convertedData.length);
		const shopifyKeys = ['tags'];
		const saveToShopify = new SaveToShopify(halfData1,URLCAD,USERKC,USERPC,shopifyKeys);
		const saveToShopify2 = new SaveToShopify(halfData2,URLCAD,USERKC,USERPC,shopifyKeys);
		 
		return Promise.all([saveToShopify.saveData(0),saveToShopify2.saveData(0)])
	})

	.then(data => {
		console.log('done saving: ',data);
		return email.send('test@email.com',SENDEMAIL,'Save Data','<b>Done saving data to Shopify</b>')
	})

	.then(data => {
		console.log('done saving');
		res.json({
			status:200,
			message:'done saving to shopify email sent'
		});
	})

	.catch(err => {
		console.log('error backing up data',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	});
});

//update tags on shopify
router.post('/update',checkKey,checkFields,checkCollectionId,(req,res) => {
	const fields = req.body.fields;
	const newUrl = req.newUrl;
	const getData = new GetData(newUrl,USERKC,USERPC,fields);
	const email = new SendMail(EMAIL,EP);
	return getData.getData([],1)

	.then(data => {
		const setTags = new SetTags(data);
		const convertedData = setTags.convertData(data);
		const halfIndex = Math.round(convertedData.length / 2);
		const halfData1 = convertedData.slice(0,halfIndex);
		const halfData2 = convertedData.slice(halfIndex,convertedData.length);
		const shopifyKeys = ['tags'];
		const saveToShopify = new SaveToShopify(halfData1,URLCAD,USERKC,USERPC,shopifyKeys);
		const saveToShopify2 = new SaveToShopify(halfData2,URLCAD,USERKC,USERPC,shopifyKeys);
		 
		return Promise.all([saveToShopify.saveData(0),saveToShopify2.saveData(0)])
	})

	.then(data => {
		return getData.getData([],1,req.collectionUrl)
	})

	.then(data => {
		console.log('done saving: ',data.length);
		return email.send('test@email.com',SENDEMAIL,'Save Data','<b>Done saving data to Shopify</b>')
	})

	.then(data => {
		console.log('done saving');
		res.json({
			status:200,
			message:'done saving to shopify email sent'
		});
	})

	.catch(err => {
		console.log('error updating to shopify',err);
		res.json({
			status:500,
			error:'an error occured'
		});
	});
});

module.exports = {router};