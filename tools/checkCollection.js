const {CKEY,URLCAD} = require('../config');

function buildUrl(collection_id){
	let newUrl = URLCAD + 'collects.json?limit=250&collection_id=' + collection_id;

	return newUrl;
}

let checkCollectionId = function(req, res, next){
	if( typeof req.body.collection_id !== 'string'){
		return res.status(422).json({
			code:422,
			message:"error type"
		});
	}
	else{
		req.collectionUrl = buildUrl(req.body.collection_id);
		next();
	}
}

module.exports = {checkCollectionId};