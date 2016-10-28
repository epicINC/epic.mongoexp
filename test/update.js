const
	chai = require('chai'),
	expect = chai.expect;

const
	query = require('../lib/query');
	exp = require('../lib/update');

let group = {
		'id' : '7dbf77c116b76b050d6cc41d23a1d837',
		'name' : '111',
		'creator' : '1000+005056BF4D75-ttf',
		'type' : 0,
		'invite' : 0,
		'auth' : 1,
		'ignores' : [{id: 'ttf', ts: 123}],
		'intro' : '',
		'notice' : '',
		'managers' : [ 
				'1000+005056BF4D75-ttf', '1000+005056BF4D75-lqq'
		],
		'members' : {
				'1000+005056BF4D75-ttf' : { 	'id' : '1000+005056BF4D75-ttf',
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


describe('Update Operators', () => {

	describe('Field Update Operators', () => {

		describe('$inc', () => {
			it('standalone', done => {
				let result = exp.inc('ver', 1);
				expect(result).to.deep.eql({ '$inc': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.inc(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$inc': { ver: 1 , ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.inc(null, {ver: 1, ts : 1});
				expect(result).to.deep.eql({ '$inc': { ver: 1 , ts: 1} });
				done();
			});
		});

		describe('$mul', () => {
			it('standalone', done => {
				let result = exp.mul('ver', 1);
				expect(result).to.deep.eql({ '$mul': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.mul(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$mul': { ver: 1 , ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.mul(null, {ver: 1, ts : 1});
				expect(result).to.deep.eql({ '$mul': { ver: 1 , ts: 1} });
				done();
			});
		});

		describe('$rename', () => {
			it('standalone', done => {
				let result = exp.rename('ver', 'newver');
				expect(result).to.deep.eql({ '$rename': { ver: 'newver' } });
				done();
			});
			it('object', done => {
				let result = exp.rename(null, {ver: 'newver', ts: 'newts'});
				expect(result).to.deep.eql({ '$rename': {ver: 'newver', ts: 'newts'} });
				done();
			});
		});

		describe('$setOnInsert', () => {
			it('standalone', done => {
				let result = exp.setOnInsert('ver', 1);
				expect(result).to.deep.eql({ '$setOnInsert': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.setOnInsert(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$setOnInsert': {ver: 1, ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.setOnInsert(null, {ver: 1, ts: 1});
				expect(result).to.deep.eql({ '$setOnInsert': {ver: 1, ts: 1} });
				done();
			});
		});

		describe('$set', () => {
			it('standalone', done => {
				let result = exp.set('ver', 1);
				expect(result).to.deep.eql({ '$set': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.set(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$set': {ver: 1, ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.set(null, {ver: 1, ts: 1});
				expect(result).to.deep.eql({ '$set': {ver: 1, ts: 1} });
				done();
			});
		});

		describe('$unset', () => {
			it('standalone', done => {
				let result = exp.unset('ver');
				expect(result).to.deep.eql({ '$unset': { ver: '' } });
				done();
			});
			it('array', done => {
				let result = exp.unset(['ver', 'ts']);
				expect(result).to.deep.eql({ '$unset': {ver: '', ts: ''} });
				done();
			});
			it('object', done => {
				let result = exp.unset(null, {'ver': '', 'ts': ''});
				expect(result).to.deep.eql({ '$unset': {ver: '', ts: ''} });
				done();
			});
		});

		describe('$min', () => {
			it('standalone', done => {
				let result = exp.min('ver', 1);
				expect(result).to.deep.eql({ '$min': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.min(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$min': {ver: 1, ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.min(null, {ver: 1, ts: 1});
				expect(result).to.deep.eql({ '$min': {ver: 1, ts: 1} });
				done();
			});
		});

		describe('$max', () => {
			it('standalone', done => {
				let result = exp.max('ver', 1);
				expect(result).to.deep.eql({ '$max': { ver: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.max(['ver', 'ts'], 1);
				expect(result).to.deep.eql({ '$max': {ver: 1, ts: 1} });
				done();
			});
			it('object', done => {
				let result = exp.max(null, {ver: 1, ts: 1});
				expect(result).to.deep.eql({ '$max': {ver: 1, ts: 1} });
				done();
			});
		});

		describe('$currentDate', () => {
			it('standalone', done => {
				let result = exp.currentDate('ts', true);
				expect(result).to.deep.eql({ '$currentDate': { ts: true } });
				done();
			});
			it('array', done => {
				let result = exp.currentDate(['as', 'ts'], 'ts');
				expect(result).to.deep.eql({ '$currentDate': {as: { $type: 'timestamp' }, ts: { $type: 'timestamp' }} });
				done();
			});
			it('object', done => {
				let result = exp.currentDate(null, {as: 'ts', ts: 'date'});
				expect(result).to.deep.eql({ '$currentDate': {as: { $type: 'timestamp' }, ts: { $type: 'date' }} });
				done();
			});
		});

	});

	describe('Array Update Operators', () => {
		describe('$', () => {

			let update = {};
			it('standalone', done => {
				let result = exp.$('field0', 't0', update);
				expect(result).to.deep.eql({ 'field0.$': 't0' });
				done();
			});
			it('array & update document in Array', done => {
				let result = exp.$(['object.id', 'field1'], 't1', update);
				expect(result).to.deep.eql({ 'object.$.id': 't1', 'field1.$': 't1', 'field0.$': 't0' });
				done();
			});
			it('object & update document in Array', done => {
				let result = exp.$(null, {'object.id': 't2', field2: 't2'}, update);
				expect(result).to.deep.eql({ 'object.$.id': 't2', 'field2.$': 't2', 'field1.$': 't1', 'field0.$': 't0' });
				done();
			});

		});

		describe('$addToSet', () => {
			let update = {};
			it('standalone', done => {
				let result = exp.addToSet('field0', ['t0'], update);
				expect(result).to.deep.eql({ '$addToSet': { field0: [ 't0' ] } });
				done();
			});
			it('array', done => {
				let result = exp.addToSet(['field1'], exp.each(null, [1,2,3]), update);
				expect(result).to.deep.eql({ '$addToSet': { field0: [ 't0' ], field1: { '$each': [ 1, 2, 3 ] } } });
				done();
			});
			it('object', done => {
				let result = exp.addToSet(null, {field2: 't2'}, update);
				expect(result).to.deep.eql({ '$addToSet': {
					field0: [ 't0' ],
			    field1: { '$each': [ 1, 2, 3 ] },
			    field2: 't2' }
			  });
				done();

			});

		});

		describe('$pop', () => {

			let update = {};
			it('standalone', done => {
				let result = exp.pop('field0', 1, update);
				expect(result).to.deep.eql({ '$pop': { field0: 1 } });
				done();
			});
			it('array', done => {
				let result = exp.pop(['field1'], -1, update);
				expect(result).to.deep.eql({ '$pop': { field0: 1, field1: -1 } });
				done();
			});
			it('object', done => {
				let result = exp.pop(null, {field2: 1}, update);
				expect(result).to.deep.eql({ '$pop': { field0: 1, field1: -1, field2: 1 } });
				done();
			});

		});

		describe('$pullAll', () => {

			let update = {};
			it('standalone', done => {
				let result = exp.pullAll('field0', [0], update);
				expect(result).to.deep.eql({ '$pullAll': { field0: [0] } });
				done();
			});
			it('array', done => {
				let result = exp.pullAll(['field1'], [1], update);
				expect(result).to.deep.eql({ '$pullAll': { field0: [0], field1: [1] } });
				done();
			});
			it('object', done => {
				let result = exp.pullAll(null, {field2: [2]}, update);
				expect(result).to.deep.eql({ '$pullAll': { field0: [0], field1: [1], field2: [2] } });
				done();
			});

		});

		describe('$pull', () => {

			let update = {};
			it('standalone', done => {
				let result = exp.pull('field0', [0], update);
				expect(result).to.deep.eql({ '$pull': { field0: [0] } });
				done();
			});
			it('array', done => {
				let result = exp.pull(['field1'], [1], update);
				expect(result).to.deep.eql({ '$pull': { field0: [0], field1: [1] } });
				done();
			});
			it('object', done => {
				let result = exp.pull(null, {field2: [2]}, update);
				expect(result).to.deep.eql({ '$pull': { field0: [0], field1: [1], field2: [2] } });
				done();
			});

		});

		describe('$push', () => {

			let update = {};
			it('standalone', done => {
				let result = exp.push('field0', 0, update);
				expect(result).to.deep.eql({ '$push': { field0: 0 } });
				done();
			});
			it('array', done => {
				let result = exp.push(['field1'], 1, update);
				expect(result).to.deep.eql({ '$push': { field0: 0, field1: 1 } });
				done();
			});
			it('object', done => {
				let result = exp.push(null, {field2: 2}, update);
				expect(result).to.deep.eql({ '$push': { field0: 0, field1: 1, field2: 2 } });
				done();
			});

		});

		describe('$each', () => {

			it('standalone', done => {
				let result = exp.each(null, [ 90, 92, 85 ]);
				expect(result).to.deep.eql({ '$each': [ 90, 92, 85 ] });
				done();
			});
			it('Use $each with $push Operator', done => {
				let result = exp.push(null, exp.each('scores', [ 90, 92, 85 ]));
				expect(result).to.deep.eql({ '$push': { scores: { '$each': [ 90, 92, 85 ] } } });
				done();
			});
			it('Use $each with $addToSet Operator', done => {
				let result = exp.addToSet(null, exp.each('tags', [ "camera", "electronics", "accessories" ]));
				expect(result).to.deep.eql({ '$addToSet': { tags: { '$each': [ "camera", "electronics", "accessories" ] } } });
				done();
			});
			it('Use object and merge', done => {
				let result = {};
				exp.push(null, exp.each(null, {'scores': [ 90, 92, 85 ]}), result);
				exp.addToSet(null, exp.each(null, {'tags': [ "camera", "electronics", "accessories" ]}), result);
				expect(result).to.deep.eql({ '$push': { '$each': { scores: [ 90, 92, 85 ] } }, '$addToSet': { '$each': { tags: [ 'camera', 'electronics', 'accessories' ] } } });
				done();
			});

		});


		describe('$slice', () => {

			it('standalone', done => {
				let result = exp.slice(null, 3);
				expect(result).to.deep.eql({ '$slice': 3 });
				done();
			});

			it('Slice from the Front of the Array', done => {
				let result = exp.push('scores', exp.combine(
						exp.each(null, [100, 20]),
						exp.slice(null, 3)
					));
				expect(result).to.deep.eql({ '$push': { scores: { '$each': [ 100, 20 ], '$slice': 3 } } });
				done();
			});

			it('Update Array Using Slice Only', done => {
				let result = exp.push('scores', exp.each(null, [], exp.slice(3)))
				expect(result).to.deep.eql({ '$push': { scores: { '$slice': 3, '$each': [] } } });
				done();
			});

		});

		describe('$sort', () => {
			it('standalone', done => {
				let result = exp.sort('score', 1);
				expect(result).to.deep.eql({$sort: { score: 1 }});
				done();
			});
			it('Sort Array of Documents by a Field in the Documents', done => {
				let result = exp.push('quizzes', exp.combine(
					exp.each(null, [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ]),
					exp.sort(null, { score: 1 })
					));
				expect(result).to.deep.eql({
			     $push: {
			       quizzes: {
			         $each: [ { id: 3, score: 8 }, { id: 4, score: 7 }, { id: 5, score: 6 } ],
			         $sort: { score: 1 }
			       }
			     }
			  });
				done();
			});
			it('Sort Array Elements That Are Not Documents', done => {
				let result = exp.push('tests', exp.combine(
					exp.each(null, [ 40, 60 ]),
					exp.sort(null, 1)
					));
				expect(result).to.deep.eql({ $push: { tests: { $each: [ 40, 60 ], $sort: 1 } } });
				done();
			});
			it('Update Array Using Sort Only', done => {
				let result = exp.push('tests', exp.combine(
					exp.each(null, []),
					exp.sort(null, -1)
					));
				expect(result).to.deep.eql({ $push: { tests: { $each: [ ], $sort: -1 } } });
				done();
			});
			it('Use $sort with Other $push Modifiers', done => {
				let result = exp.push('quizzes', exp.combine(
					exp.each(null, [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ]),
					exp.sort('score', -1),
					exp.slice(null, 3)
					));
				expect(result).to.deep.eql(
			   {
			     $push: {
			       quizzes: {
			          $each: [ { wk: 5, score: 8 }, { wk: 6, score: 7 }, { wk: 7, score: 6 } ],
			          $sort: { score: -1 },
			          $slice: 3
			       }
			     }
			   }
				);
				done();
			});
		});


		describe('$position', () => {
			it('standalone', done => {
				let result = exp.position('scores', 0);
				expect(result).to.deep.eql({$position: { scores: 0 }});
				done();
			});
			it('Add Elements at the Start of the Array', done => {
				let result = exp.push('scores', exp.combine(
					exp.each(null, [ 50, 60, 70 ]),
					exp.position(null, 0)
				));
				expect(result).to.deep.eql({
			     $push: {
			        scores: {
			           $each: [ 50, 60, 70 ],
			           $position: 0
			        }
			     }
			   });
				done();
			});
			it('Add Elements to the Middle of the Array', done => {
				let result = exp.push('scores', exp.combine(
					exp.each(null, [ 20, 30 ]),
					exp.position(null, 2)
				));
				expect(result).to.deep.eql({
			     $push: {
			        scores: {
			           $each: [ 20, 30 ],
			           $position: 2
			        }
			     }
			   });
				done();
			});

		});


	});


});



function WL(result) {
	console.dir(result, {depth: null, colors: true});
}