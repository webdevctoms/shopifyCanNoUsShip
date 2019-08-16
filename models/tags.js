const mongoose = require('mongoose');

//main shcema
const tagSchema = mongoose.Schema({
	product_id:{type:String,required:true,unique:true},
	product_title:{type:String},
	tags:{type:String,default:""}
},{minimize:false});

tagSchema.methods.serialize = function(){
	return{
		product_id:this.product_id,
		product_title:this.product_title,
		tags:this.tags
	}
};

const Tags = mongoose.model("Tags",tagSchema);
module.exports = {Tags};