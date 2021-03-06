const request = require('request');

function GetData(url,user_k,user_p,fields){
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
	//array of strings that match the fields in the url
	//used to build the return data
	this.fields = fields;
}
//Only capture data from first variant because if we need all variant data
//can just copy that to a variants field and then save the correct data
GetData.prototype.setFields = function(product){
	let newObject = {};
	for(let i = 0;i < this.fields.length;i++){
		//only capture data from first variant
		let field = this.fields[i];
		if(!product[field] && product.variants){

			newObject[field] = product.variants[0][field];
		}
		else{
			newObject[field] = product[field];
		}
	}

	return newObject;
};

GetData.prototype.logger = function(parsedBody){
	if(parsedBody.products){
		return parsedBody.products;
	}
	else if(parsedBody.metafields){
		return parsedBody.metafields;
	}
	else if(parsedBody.collects){
		return parsedBody.collects;
	}
	else{
		return [];
	}
};

GetData.prototype.getData = function(dataArray,page,url) {
	if(dataArray === undefined){
		dataArray = [];
	}
	let promise = new Promise((resolve,reject) => {
		let newUrl;
		if(url === undefined){
			newUrl = this.url;
		}
		else{
			newUrl = url;
		}

		if(page !== undefined){
			newUrl += "&page=" + page;
		}
		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		//console.log(newUrl,this.user_k,this.user_p,authKey);
		const options = {
			url:newUrl,
			headers:{
				"Authorization":"Basic " + authKey
			}
		}
		console.log("===============Making request",newUrl,page);
		request(options,function(error,response,body){
			
			let parsedBody = JSON.parse(body);
			let log = this.logger(parsedBody);
			console.log("===============Got data: ",log.length);
			if(log.length !== 0){
				//possibly just push data straight into dataArray?
				for(let i = 0;i < log.length;i++){
					let currentProduct = log[i];
					
					dataArray.push(currentProduct);
				}
				//let lastId = parsedBody.products[parsedBody.products.length - 1].id;
				resolve(this.getData(dataArray,page + 1,url));
			}
			else{
				
				resolve(dataArray);
			}

		}.bind(this));
	});

	return promise;
};

GetData.prototype.getDataFromArray = function(dataArray,collectionData,url,productIndex) {
	if(dataArray === undefined){
		dataArray = [];
	}
	let promise = new Promise((resolve,reject) => {
		if(productIndex < collectionData.length){
			let productID = collectionData[productIndex].product_id;
			let newUrl = url + "products/" + productID + ".json";

			const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
			//console.log(newUrl,this.user_k,this.user_p,authKey);
			const options = {
				url:newUrl,
				headers:{
					"Authorization":"Basic " + authKey
				}
			}
			console.log("===============Making request",newUrl,productIndex);
			request(options,function(error,response,body){
				
				let parsedBody = JSON.parse(body);
				console.log("===============Got data: ",parsedBody.product.title);		
				dataArray.push(parsedBody.product);
				resolve(this.getDataFromArray(dataArray,collectionData,url,productIndex + 1));				
			}.bind(this));
		}
		else{	
			resolve(dataArray);
		}
		
	});

	return promise;
};

//meant for sorting by variant
GetData.prototype.sortData = function(arr,key1,key2){
	return arr.sort((a,b) => {
		a[key1].sort((variant1,variant2) => {
			if(variant1[key2] < variant2[key2]){
				return -1;
			}
			else{
				return 1;
			}
		});
		b[key1].sort((variant1,variant2) => {
			if(variant1[key2] < variant2[key2]){
				return -1;
			}
			else{
				return 1;
			}
		});
		if(a[key1][0][key2] < b[key1][0][key2]){
			return -1;
		} 	
		else{
			return 1;
		}
	});
};

module.exports = {GetData};