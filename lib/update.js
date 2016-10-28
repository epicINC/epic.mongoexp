const 
	epic = require('epic.util'),
	util = require('./util');


class Extensions {

	static currentDate (value) {
		if (!value || value === true) return true;
		if (value === 'ts') value = 'timestamp';
		return { $type: value };
	}

	static isNullOrUndefined (value) {
		return value === undefined || value === null;
	}

	static $ (field) {
		let offset = field.indexOf('.');
		if (offset === -1) return field +'.$';
		return field.substr(0, offset) +'.$'+ field.substr(offset);
	}

	// string undefined undefined
	// string any undefined
	// string any object
	// 
	// [string, string], undefined undefined
	// [string, string], any undefined
	// [string, string], any object
	// 
	// object undefined undefined
	// object any undefined
	// object any undefined
	static args (fields, docs, result) {
		let hasValues = [Extensions.isNullOrUndefined(fields), Extensions.isNullOrUndefined(docs), Extensions.isNullOrUndefined(result)];

		if (typeof(fields) === 'object') {

		}


		if (typeof(fields) === 'object' && !Array.isArray(fields)) {
			if (!Extensions.isNullOrUndefined(docs) &&  Extensions.isNullOrUndefined(result))
				[fields, docs, result] = [undefined, fields, docs];
			else
				[fields, docs] = [undefined, fields]
		}
		return [fields, docs, result];
	}
}




class Update {



	// Field Update Operators

	// Syntax: { $inc: { <field1>: <amount1>, <field2>: <amount2>, ... } }
	static inc (fields, docs, result) {
		return util.append('$inc', util.append(fields, docs), result);
	}


	// Syntax: { $mul: { field: <number> } }
	static mul (fields, docs, result) {
		return util.append('$mul', util.append(fields, docs), result);
	}

	// Syntax: {$rename: { <field1>: <newName1>, <field2>: <newName2>, ... } }
	static rename (fields, docs, result) {
		return util.append('$rename', util.append(fields, docs), result);
	}

	// Syntax: {$setOnInsert: { <field1>: <value1>, ... } }
	static setOnInsert (fields, docs, result) {
		return util.append('$setOnInsert', util.append(fields, docs), result);
	}
	
	// Syntax: { $set: { <field1>: <value1>, ... } }
	static set (fields, docs, result) {
		return util.append('$set', util.append(fields, docs), result);
	}

	// Syntax: { $unset: { <field1>: "", ... } }
	static unset (fields, docs, result) {
		return util.append('$unset', util.append(fields, docs || ''), result);
	}

	// Syntax: { $min: { <field1>: <value1>, ... } }
	static min (fields, docs, result) {
		return util.append('$min', util.append(fields, docs), result);
	}

	// Syntax: { $max: { <field1>: <value1>, ... } }
	static max (fields, docs, result) {
		return util.append('$max', util.append(fields, docs), result);
	}

	/*
	Syntax: { $currentDate: { <field1>: <typeSpecification1>, ... } }
	typeSpecification
		true<Date> | { $type: "timestamp" } | { $type: "date" } 
	*/
	static currentDate (fields, docs, result) {
		if (!fields) {
			Object.keys(docs).forEach(e => docs[e] = Extensions.currentDate(docs[e]));
			return util.append('$currentDate', docs, result);
		}

		return util.append('$currentDate', util.append(fields, Extensions.currentDate(docs)), result);
	}




	// Array Update Operators

	// Syntax: { "<array>.$" : value }
	static $ (fields, docs, result) {
		if (!fields) {
			Object.keys(docs).forEach(e => {
				docs[Extensions.$(e)] = docs[e];
				delete docs[e];
			});
			return util.append(undefined, docs, result);
		}

		epic.each(fields, (e , i) => {
			if (i > -1)
				fields[i] = Extensions.$(e);
			else
				fields = Extensions.$(e);
		});
		return util.append(undefined, util.append(fields, docs), result);
	}


	// Syntax: { $addToSet: { <field1>: <value1>, ... } }
	static addToSet (fields, docs, result) {
		return util.append('$addToSet', util.append(fields, docs), result);
	}

	// Syntax: { $pop: { <field>: <-1 | 1>, ... } }
	static pop (fields, docs, result) {
		return util.append('$pop', util.append(fields, docs), result);
	}

	// Syntax: { $pullAll: { <field1>: [ <value1>, <value2> ... ], ... } }
	static pullAll (fields, docs, result) {
		return util.append('$pullAll', util.append(fields, docs), result);
	}

	// Syntax: { $pull: { <field1>: <value|condition>, <field2>: <value|condition>, ... } }
	static pull (fields, docs, result) {
		return util.append('$pull', util.append(fields, docs), result);
	}

	// Syntax: { $push: { <field1>: <value1>, ... } }
	static push (fields, docs, result) {
		return util.append('$push', util.append(fields, docs), result);
	}

	// Syntax: { <field>: { $each: [ <value1>, <value2> ... ]}}
	static each (fields, docs, result) {
		return util.append(undefined, util.append(fields, {$each: docs}), result);
	}

	// Syntax: { <field>: {$slice: <num>}}
	static slice (fields, docs, result) {
		if (!docs)
			[fields, docs] = [undefined, fields];

		return util.append('$slice', util.append(fields, docs), result);
	}

	// Syntax: { <field>: {$sort: { field: 1, ... }}
	// sort specification: specify 1 for ascending or -1 for descending.
	static sort (fields, docs, result) {
		return util.append('$sort', util.append(fields, docs), result);
	}


	// Syntax: { <field>: {$position: <num>}}
	static position (fields, docs, result) {
		return util.append('$position', util.append(fields, docs), result);
	}


	static combine (result, ...queries) {
		queries.forEach(e => util.append(undefined, e, result));
		return result;
	}


	static flat (docs, pairs = [], result = {}) {

		if (typeof(docs) !== 'object') return pairs.length === 0 ? docs : result[pairs.join('.')] = docs;

		if (Array.isArray(docs))
			docs.forEach((e, i) => Update.flat(e, pairs.concat(i), result));
		else
			Object.keys(docs).forEach(e => {
				if (!docs.hasOwnProperty(e)) return;
				Update.flat(docs[e], pairs.concat(e), result)
			});

		return result;
	}
}

Update.combine = util.combine;

module.exports = Update;