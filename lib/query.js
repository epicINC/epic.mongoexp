const 
	epic = require('epic.util'),
	util = require('./util');


class Query {


	// Comparison Query Operators

	// Syntax: { <field>: { $eq: <value> } }
	static eq (fields, docs, result) {
		if (!docs) return result || {};
		if (!fields) return docs;
		return util.append(fields, {$eq: docs}, result);
	}

	// Syntax: {field: {$ne: value} }
	static ne (fields, docs, result) {
		if (!docs) return result || {};
		if (!fields) return docs;
		return util.append(fields, {$ne: docs}, result);
	}

	// Syntax: { field: { $in: [<value1>, <value2>, ... <valueN> ] } }
	static in (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, { $in: Array.isArray(docs) ? docs : [docs] }, result);
	}

	// Syntax: { field: { $nin: [ <value1>, <value2> ... <valueN> ]} }
	static nin (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, { $nin: Array.isArray(docs) ? docs : [docs] }, result);
	}

	/**
	 * 搜索第一个匹配。
	 *	
	 * @param      {<type>}    docs      文档内容
	 * regex: *, ^ $,
	 * fulltextsearch: %
	 * @param      {Function}  selector  选择器
	 * @param      {<type>}    result    结果
	 * @return     {<type>}    { description_of_the_return_value }
	 */
	static search (fields, docs, result) {
		if (!docs) return result || {};
		let start = docs[0], end = docs[docs.length - 1];

		if (start === '*')
			return Query.regex(fields, {$regex: end === '*' ? docs.substring(1, docs.length - 1) : docs.substr(1), $options: 'i'}, result);
		else if (start === '^' || end === '$')
			return Query.regex(fields, {$regex: docs, $options: 'i'}, result);
		else if (start === '%') {
			return Query.text(end === '%' ? docs.substring(1, docs.length - 1) : docs.substr(1), null, result);
		}
		
		return Query.eq(fields, docs, result);
	}

	// Syntax: {field: {$gt: value} }
	static compare (fields, docs, result) {
		if (!docs) return result || {};

		if (Array.isArray(docs)) {
			if (docs.length === 0) return result || {};
			if (docs.length === 1) return Query.compare(fields, docs[0], result);
			if (docs.length > 2) docs = [epic.array.min(docs), epic.array.max(docs)];
			docs = {$gt: Number(docs[0]), $lt:Number(docs[1])};
		} else {
			switch (typeof(docs)) {
				case 'string' :
					if (docs.startsWith('>='))
						docs = {$gte: Number(docs.substr(2))};
					else if (docs.startsWith('>'))
						docs = {$gt: Number(docs.substr(1))};
					else if (docs.startsWith('<='))
						docs = {$lte: Number(docs.substr(2))};
					else if (docs.startsWith('<'))
						docs = {$lt: Number(docs.substr(1))};
					break;
			}
		}

		return util.append(fields, docs, result);
	}

	static gt (fields, docs, result) {
		return util.append(fields, {$gt: docs}, result);
	}

	static gte (fields, docs, result) {
		return util.append(fields, {$gte: docs}, result);
	}

	static lt (fields, docs, result) {
		return util.append(fields, {$lt: docs}, result);
	}

	static le (fields, docs, result) {
		return util.append(fields, {$lte: docs}, result);
	}

	// Logical Query Operators 

	// Syntax: { $or: [ { <expression1> }, { <expression2> }, ... , { <expressionN> } ] }
	static or (docs, result) {
		if (!docs) return result || {};
		return util.append('$or', Array.isArray(docs) ? docs : [docs], result);
	}

	// Syntax: { $and: [ { <expression1> }, { <expression2> } , ... , { <expressionN> } ] }
	static and (docs, result) {
		if (!docs) return result || {};
		return util.append('$and', Array.isArray(docs) ? docs : [docs], result);
	}

	// Syntax: { field: { $not: { <operator-expression> } } }
	static not (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, {$not: docs}, result);
	}

	// Syntax: { $nor: [ { <expression1> }, { <expression2> }, ...  { <expressionN> } ] }
	static nor (docs, result) {
		if (!docs) return result || {};
		return util.append('$nor', Array.isArray(docs) ? docs : [docs], result);
	}


	// Element Query Operators 

	// Syntax: { field: { $exists: <boolean> } }
	static exists (fields, value = true, result) {
		return util.append(fields, {$exists: value}, result);
	}

	// Syntax: { field: { $type: <BSON type number> | <String alias> } }
	static type (fields, type, result) {
		if (!type) return result || {};
		return util.append(fields, {$type: type}, result);
	}


	// Evaluation Query Operators

	// Syntax: { field: { $mod: [ divisor, remainder ] } }
	static mod (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, {$mod: docs}, result);
	}

	/*
	Syntax: 
	{ <field>: { $regex: /pattern/, $options: '<options>' } }
	{ <field>: { $regex: 'pattern', $options: '<options>' } }
	{ <field>: { $regex: /pattern/<options> } }
	*/
	static regex (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, typeof(docs) === 'object' && docs.hasOwnProperty('$regex') ? docs : {$regex: docs}, result);
	}

	/*
	Syntax: 
	{
	  $text:
	    {
	      $search: <string>,
	      $language: <string>,
	      $caseSensitive: <boolean>,
	      $diacriticSensitive: <boolean>
	    }
	}
	*/
	static text (docs, options, result) {
		if (!docs) return result || {};
		return util.append('$text', options ? Object.assign({$search: docs}, options) : {$search: docs}, result);
	}

	/*
	Syntax: 
	{
	  $where:<string>|<function>
	}
	Available Properties:
	args
	MaxKey
	MinKey

	Available Functions:
	assert()				Map()
	BinData()				MD5()
	DBPointer()			NumberInt()
	DBRef()					NumberLong()
	doassert()			ObjectId()
	emit()					print()
	gc()						printjson()
	HexData()				printjsononeline()
	hex_md5()				sleep()
	isNumber()			Timestamp()
	isObject()			tojson()
	ISODate()				tojsononeline()
	isString()			tojsonObject()
									UUID()
									version()
	*/
	static where (fn, result) {
		if (!fn) return result || {};
		return util.append(undefined, {$where: fn}, result);
	}



	// Geospatial Query Operators


	// Query Operator Array


	// Syntax: { <field>: { $all: [ <value1> , <value2> ... ] } }
	static all (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, {$all: docs}, result);
	}

	// Syntax: { <field>: { $elemMatch: { <query1>, <query2>, ... } } }
	static elemMatch (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, {$elemMatch: docs}, result);
	}

	// Syntax: { <field>: { $size: number } }
	static size (fields, docs, result) {
		if (!docs) return result || {};
		return util.append(fields, {$size: docs}, result);
	}



	// Bitwise Query Operators
	

	static comment (docs, result) {
		if (!docs) return result || {};
		return util.append('$comment', docs, result);
	}


	// Projection Operators
	
	// Syntax: {<field>.$: position}
	static $ (fields, docs, result) {
		if (!fields || !docs) return result || {};
		fields = epic.map(fields, e => e +'.$');
		return util.append(fields, docs, result);
	}
	

	// Syntax: { $meta: <metaDataKeyword> }
	static meta (fields, result) {
		return util.append(fields, {$meta: 'textScore'}, result);
	}

	// Syntax: { array: {$slice: skip|[skip, limit] } }
	static slice (fields, docs, result) {
		if (!docs === undefined || docs === null) return result || {};
		return util.append(fields, {$slice: docs}, result);
	}



};
Query.eql = Query.compare;
Query.combine = util.combine;
module.exports = Query;

