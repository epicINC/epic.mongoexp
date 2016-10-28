const
	chai = require('chai'),
	expect = chai.expect;

const exp = require('../lib/query');

let group = {
    'id' : '7dbf77c116b76b050d6cc41d23a1d837',
    'name' : '111',
    'creator' : '1000+005056BF4D75-ttf',
    'type' : 0,
    'invite' : 0,
    'auth' : 1,
    'ignores' : [],
    'intro' : '',
    'notice' : '',
    'managers' : [ 
        '1000+005056BF4D75-ttf', '1000+005056BF4D75-lqq'
    ],
    'members' : {
        '1000+005056BF4D75-ttf' : {
            'id' : '1000+005056BF4D75-ttf',
            'alias' : '',
            'ts' : 1466060102637.0
        },
        '1000+005056BF4D75-lqq' : {
            'id' : '1000+005056BF4D75-lqq',
            'alias' : '',
            'ts' : 1466060102637.0
        }
    },
    'tags' : [],
    'ver' : 1,
    'ts' : 1466060102637.0,
    'as' : 1466060102637.0
};



describe('Query and Projection Operators', () => {

	describe('Comparison Query Operators', () => {

		describe('$eq', () => {
			it('#eq', done => {
				let result = exp.eq('name', group.name, exp.eq('id', group.id));
				expect(result).to.deep.eql({ id: { '$eq': '7dbf77c116b76b050d6cc41d23a1d837' }, name: {"$eq": "111"} });
				done();
			});
		});


		describe('$ne', () => {

			it('#ne', done => {
				let result = exp.ne('name', group.name, exp.ne('id', group.id));
				expect(result).to.deep.eql({ id: { '$ne': '7dbf77c116b76b050d6cc41d23a1d837' }, name: {"$ne": "111"} });
				done();
			});
		});

		describe('search', () => {
			it('# ^keywords, startsWith', done => {
				let result = exp.search('name', '^' + group.name);
				expect(result).to.deep.eql({ name: {$eq: new RegExp('^' + group.name, 'i')} });
				done();
			});

			it('# keywords$, endsWith', done => {
				let result = exp.search('name', group.name + '$');
				expect(result).to.deep.eql({ name: {$eq: new RegExp(group.name + '$', 'i')} });
				done();
			});

			it('# ^keywords$, startsWith && endsWith', done => {
				let result = exp.search('name', '^' + group.name + '$');
				expect(result).to.deep.eql({ name: {$eq: new RegExp('^' + group.name + '$', 'i')} });
				done();
			});

			it('# *keywords, fuzzy', done => {
				let result = exp.search('name', '*' + group.name);
				expect(result).to.deep.eql({ name: {$eq: new RegExp(group.name, 'i')} });
				done();
			});

			it('# *keywords*, fuzzy', done => {
				let result = exp.search('name', '*' + group.name + '*');
				expect(result).to.deep.eql({ name: {$eq: new RegExp(group.name, 'i')} });
				done();
			});

			it('# %keywords, fulltext', done => {
				let result = exp.search('name', '%' + group.name);
				expect(result).to.deep.eql({ '$text': { '$search': group.name } });
				done();
			});

			it('# %keywords%, fulltext', done => {
				let result = exp.search('name', '%' + group.name +'%');
				expect(result).to.deep.eql({ '$text': { '$search': group.name } });
				done();
			});

		});

		describe('compare', () => {
			it('#eql', done => {
				let result = exp.compare('ts', group.ts);
				expect(result).to.deep.eql({ ts: group.ts });
				done();
			});

			it('#greater than', done => {
				let result = exp.compare('ts', '>' + group.ts);
				expect(result).to.deep.eql({ ts: {$gt: group.ts} });
				done();
			});

			it('#greater than or equal', done => {
				let result = exp.compare('ts', '>=' + group.ts);
				expect(result).to.deep.eql({ ts: {$gte: group.ts} });
				done();
			});

			it('#less than', done => {
				let result = exp.compare('ts', '<' + group.ts);
				expect(result).to.deep.eql({ ts: {$lt: group.ts} });
				done();
			});

			it('#less than or equal', done => {
				let result = exp.compare('ts', '<=' + group.ts);
				expect(result).to.deep.eql({ ts: {$lte: group.ts} });
				done();
			});

			it('#range', done => {
				let result = exp.compare('ts', [group.ts - 1, group.ts + 1]);
				expect(result).to.deep.eql({ ts: {$gt: group.ts -1, $lt: group.ts + 1} });
				done();
			});

			it('#array', done => {
				let result = exp.compare('ts', [4, 5, 1, 10]);
				expect(result).to.deep.eql({ ts: {$gt: 1, $lt: 10} });
				done();
			});

		});

		describe('$in', () => {

			it('#simple', done => {
				let result = exp.in('managers', group.managers);
				expect(result).to.deep.eql({ managers: {$in: group.managers} });
				done();
			});

			it('#complex', done => {
				let query = { managers: { '$in': [ 1, 2 ] } };
				let result = exp.in('managers', Object.values(group.members).map(e => e.id), query);
				expect(result.managers['$in']).to.deep.eql([1,2].concat(Object.values(group.members).map(e => e.id)));
				done();
			});

		});

		describe('$nin', () => {

			it('#simple', done => {
				let result = exp.nin('managers', group.managers);
				expect(result).to.deep.eql({ managers: {$nin: group.managers} });
				done();
			});

			it('#complex', done => {
				let query = { managers: { '$nin': [ 1, 2 ] } };
				let result = exp.nin('managers', Object.values(group.members).map(e => e.id), query);
				expect(result.managers['$nin']).to.deep.eql([1,2].concat(Object.values(group.members).map(e => e.id)));
				done();
			});

		});


	});



	describe('Logical Query Operators', () => {

		describe('$or', () => {
			it('#simple', done => {
				let result = exp.or([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				]);
				expect(result).to.deep.eql({ '$or': [ { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});

			it('#complex', done => {
				let query = { $or: [{name:'test'}] };
				let result = exp.or([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				], query);
				expect(result).to.deep.eql({ '$or': [{name: 'test'},  { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});

		});

		describe('$and', () => {
			it('#simple', done => {
				let result = exp.and([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				]);
				expect(result).to.deep.eql({ '$and': [ { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});

			it('#complex', done => {
				let query = { $and: [{name:'test'}] };
				let result = exp.and([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				], query);
				expect(result).to.deep.eql({ '$and': [{name: 'test'},  { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});
		});

		describe('$not', () => {
			it('#simple', done => {
				let result = exp.not('ts', exp.eql(null, [1,10]));
				expect(result).to.deep.eql({ ts: { '$not': { '$gt': 1, '$lt': 10 } } });
				done();
			});
		});

		describe('$nor', () => {
			it('#simple', done => {
				let result = exp.nor([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				]);
				expect(result).to.deep.eql({ '$nor': [ { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});

			it('#complex', done => {
				let query = { $nor: [{name:'test'}] };
				let result = exp.nor([
					exp.eql('ts', '>' + group.ts),
					exp.eq('id', group.id)
				], query);
				expect(result).to.deep.eql({ '$nor': [{name: 'test'},  { ts: { '$gt': 1466060102637 } }, { id: {$eq: '7dbf77c116b76b050d6cc41d23a1d837'} } ] });
				done();
			});
		});


	});

	describe('Element Query Operators', () => {

		describe('$exists', () => {
			it('#simple', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.exists(['id', 'name'], undefined, query);
				expect(result).to.deep.eql({ id: { '$exists': true, $nin:[5, 15]}, name: { '$exists': true } });
				done();
			});

			it('#complex', done => {
				let query = exp.nin('members.1000+005056BF4D75-ttf', [5, 15]);
				let result = exp.exists(Object.values(group.members).map(e => 'members.'+ e.id), true, query);
				expect(result).to.deep.eql({ 'members.1000+005056BF4D75-ttf': { '$nin': [ 5, 15 ], '$exists': true }, 'members.1000+005056BF4D75-lqq': { '$exists': true } });
				done();
			});

		});

		describe('$type', () => {
			it('#simple', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.type(['id', 'name'], 'minKey', query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ], '$type': 'minKey' }, name: { '$type': 'minKey' } });
				done();
			});

		});

	});


	describe('Evaluation Query Operators', () => {

		describe('$mod', () => {
			it('#simple', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.mod('id', [4, 0], query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ], '$mod': [ 4, 0 ] } });
				done();
			});
		});


		describe('$regex', () => {
			it('#string', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.regex('id', 'test', query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ], '$regex': 'test' } });
				done();
			});

			it('#regex', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.regex('id', /test/, query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ], '$regex': /test/ } });
				done();
			});

			it('#object', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.regex('id', {$regex: 'test', $options: 'imxs'}, query);
				expect(result).to.deep.eql({ id:
	   		{ '$nin': [ 5, 15 ],
	     '$regex': 'test',
	     '$options': 'imxs' } });
				done();
			});

		});

		describe('$text', () => {
			it('#direct', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.text('test', null, query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ] }, '$text': { '$search': 'test' } });
				done();
			});

			it('#options', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.text('test', {$language: 'zh-cn', $caseSensitive: false, $diacriticSensitive: true}, query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ] },
	  '$text':
	   { '$search': 'test',
	     '$language': 'zh-cn',
	     '$caseSensitive': false,
	     '$diacriticSensitive': true } });
				done();
			});

		});

		describe('$where', () => {
			it('#string', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.where('this.id > 1', query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ] }, '$where': 'this.id > 1' });
				done();
			});
			it('#function', done => {
				let fn = function(){return this.id>1;};
				let query = {id: {$nin:[5, 15]}}
				let result = exp.where(fn, query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ] }, '$where': fn });
				done();
			});
		});

	});


	describe('Geospatial Query Operators', () => {


	});




	describe('Query Operator Array', () => {

		describe('$all', () => {
			it('#direct', done => {
				let query = {id: {$nin:[5, 15]}}
				let result = exp.all('id', [1,2], query);
				expect(result).to.deep.eql({ id: { '$nin': [ 5, 15 ], '$all': [ 1, 2 ] } });
				done();
			});
			it('#complex', done => {
				let result = exp.all('qty', [
					exp.elemMatch(null, exp.combine(null, exp.eq('size', 'M'), exp.gt('num', 50))),
					exp.elemMatch(null, exp.combine(null, exp.eq('num', '100'), exp.eq('color', 'green'))),
					]);

				expect(result).to.deep.eql({ qty: { '$all':
	      [ { '$elemMatch': { size: { '$eq': 'M' }, num: { '$gt': 50 } } },
	        { '$elemMatch': { num: { '$eq': '100' }, color: { '$eq': 'green' } } } ] } });
				done();
			});

		});

		describe('$elemMatch', () => {
			it('#direct', done => {
				let result = exp.elemMatch('id', exp.eql(null, [1, 8]));
				expect(result).to.deep.eql({ id: { '$elemMatch': { '$gt': 1, '$lt': 8 } } });
				done();
			});
		});
		describe('$size', () => {
			it('#direct', done => {
				let result = exp.size('managers', 2);
				expect(result).to.deep.eql({ managers: { '$size': 2 } });
				done();
			});
		});

	});




	describe('comment', () => {
		it('#direct', done => {
				let result = exp.comment('test');
				expect(result).to.deep.eql({ '$comment': 'test' });
				done();
		});
		it('#merge', done => {
				let result = exp.comment('test', exp.eq('id', 1));
				expect(result).to.deep.eql({ id: { '$eq': 1 }, '$comment': 'test' });
				done();
		});

	});

	describe('Projection Operators', () => {
		describe('$', () => {
			it('#direct', done => {
					let result = exp.$('managers', 1);
					expect(result).to.deep.eql({ 'managers.$': 1 });
					done();
			});
		});

		describe('$elemMatch', () => {
			it('#eg: $elemMatch (query)', done => done());
		});
		describe('$meta', () => {
			it('#direct', done => {
					let result = exp.meta('managers');
					expect(result).to.deep.eql({ 'managers': {$meta: 'textScore' }});
					done();
			});

		});
		describe('$slice', () => {
			it('#skip', done => {
					let result = exp.slice('managers', -5);
					expect(result).to.deep.eql({ 'managers': {$slice: -5 }});
					done();
			});

			it('#skip & limit', done => {
					let result = exp.slice('managers', [1, 2]);
					expect(result).to.deep.eql({ 'managers': {$slice: [1, 2] }});
					done();
			});
		});

	});


});

function WL(result) {
	console.dir(result, {depth: null, colors: true});
}