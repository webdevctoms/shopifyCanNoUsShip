function SetTags(productData){
	this.vendorMap = [
		'V0811',
		'V0106',
		'V1391',
		'V0111',
		'V0814',
		'V0115',
		'V0112',
		'V0114',
		'V1100',
		'V0181',
		'V0125',
		'V0526',
		'V1063',
		'V0104',
		'V0116',
		'V0162'
	];
	this.productData = productData;
	this.newTag = "__no-us-ship";
}
//change published at data
SetTags.prototype.convertData = function() {
	for(let i = 0;i < this.productData.length;i++){
		for(let k = 0;k < this.vendorMap.length;k++){
			if(this.productData[i].vendor.includes(this.vendorMap[k]) && !(this.productData[i].tags.includes(this.newTag))){
				this.productData[i].tags += ', ' + this.newTag;
				break;
			}
		}
	}

	return this.productData;
};
//used to convert collection data
SetTags.prototype.convertAllData = function(data) {
	//console.log(data);
	for(let i = 0;i < data.length;i++){
		if(!(data[i].tags.includes(this.newTag))){
			data[i].tags += ', ' + this.newTag;
		}
	}

	return data;
};

module.exports = {SetTags};