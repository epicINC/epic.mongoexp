const 
	epic = require('epic.util');

const cache = {};

class Util {

	static merge (target, ...sources) {
		if (target === undefined || target === null) throw new TypeError('Cannot convert undefined or null to object');

		if (Array.isArray(target)) return target.concat(...sources);

		let result = Object(target);

		sources.forEach(source => {

			for (let key in source) {
				if (!source.hasOwnProperty(key)) continue;
					// 有属性, 合并;
					// 无属性, 覆盖
				result[key] = result.hasOwnProperty(key) ? Util.mergeObject(result[key], source[key]) : source[key];
			}
		});

		return result;
	}

	static mergeObject(target, source) {
		if (target === undefined || target === null) return source;
		let targetType = typeof(target), sourceType = typeof(source);

		if (targetType !== sourceType || targetType !== 'object') return source;
		return Array.isArray(target) ? target.concat(source) : Util.merge(target, source);
	}

	static append (fields, docs, result) {
		if (docs === undefined || docs === null) return result;
		if (!fields) return result ? Util.merge(result, docs) : docs;
		if (!result) result = {};
		let field;
		epic.each(fields, e => {
			field = Util.selector(e)(docs);
			if (result.hasOwnProperty(field))
				result[field] = Util.merge(result[field], docs);
			else
				result[field] = docs;
		});
		return result;
	}

	static selector (selector, docs) {
		if (!selector) return docs;
		if (!cache[selector])
			return cache[selector] = typeof(selector) === 'function' ? selector : e => selector;
		return cache[selector];
	}


	static combine (result, ...queries) {
		if (!result) result = {};
		queries.forEach(e => Util.append(undefined, e, result));
		return result;
	}
	
	static wl(args) {
		console.dir(args, {depth:null, colors: true});
	}
}


module.exports = Util;