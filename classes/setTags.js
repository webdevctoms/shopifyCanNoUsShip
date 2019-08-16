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

module.exports = {SetTags};