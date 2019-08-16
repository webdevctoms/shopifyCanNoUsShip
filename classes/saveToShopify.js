const request = require('request');
//expect data in same format as the update data from csv
function SaveToShopify(productData,url,user_k,user_p,productKeys){
	this.productData = productData;
	this.url = url;
	this.user_k = user_k;
	this.user_p = user_p;
	this.productKeys = productKeys;
}
//this requires that the data be converted to shopify format before this
SaveToShopify.prototype.buildData = function(data){
	let newData = {}
	for(let i = 0;i < this.productKeys.length;i++){
		const key = this.productKeys[i];
		newData[key] = data[key];
	}

	return newData;
};

SaveToShopify.prototype.saveData = function(productIndex) {
	let promise = new Promise((resolve,reject) => {
		let productID = this.productData[productIndex].product_id ? this.productData[productIndex].product_id:this.productData[productIndex].id;
		let newUrl = this.url + "products/" + productID + ".json";
		console.log(newUrl);
		const authKey = Buffer.from(this.user_k + ":" + this.user_p).toString('base64');
		const newData = this.buildData(this.productData[productIndex]);
		const options = {
			url:newUrl,
			method:"PUT",
			headers:{
				"Authorization":"Basic " + authKey
			},
			json:{
				"product":newData
			}
		};

		request(options,function(error,response,body){
			if(body.errors){
				console.log(body);
			}
			//console.log(body);
			//let parsedBody = JSON.parse(body);
			let title = this.productData[productIndex].product_title ? this.productData[productIndex].product_title : this.productData[productIndex].title;
			console.log("===============PUT data: ",productIndex,this.productData.length,title);
			if(productIndex < this.productData.length - 1){
				resolve(this.saveData(productIndex + 1));
			}
			else{
				console.log("final price update");
				resolve(body);
			}
			

		}.bind(this));
	});

	return promise;
};

module.exports = {SaveToShopify};