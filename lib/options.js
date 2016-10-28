
const exists = ['fields', 'limit', 'order', 'skip'];


module.exports = function (options) {
	if (!options) return;
	let type = typeof(options);
	if (type !== 'object') return;
	let keys = Object.keys(options);
	if (keys.length === 0) return;

	let result;
	
	exists.forEach(e => {
		if (!options.hasOwnProperty(e)) return;
		if (!result) result = {};
		result[e] = options[e];
	});

	return result;

}


function Options () {
let aggregate = ['readPreference', 'cursor', 'explain', 'allowDiskUse', 'maxTimeMS', 'bypassDocumentValidation', 'raw', 'promoteLongs', 'promoteValues', 'promoteBuffers']
let bulkWrite = ['w', 'wtimeout', 'j', 'serializeFunctions', 'ordered', 'bypassDocumentValidation']
let count = ['limit', 'skip', 'hint', 'readPreference', 'maxTimeMS']


let insert = ['w','wtimeout','j','serializeFunctions','forceServerObjectId','bypassDocumentValidation']
}



