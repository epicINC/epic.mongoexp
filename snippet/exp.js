const exp = require('../lib/exp');

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
}


console.log('eql:');
console.log(exp.eql('id', group.id));

console.log('exists:');
console.log(exp.exists('id', null, {'1000+005056BF4D75-ttf': {$nin: [1,2]}}));

console.log('in:');
console.dir(exp.in('group.managers', group.managers, null, { 'group.managers': { '$in': [ 1, 2] } }));

return;
console.log('unset');
console.log(exp.unset(group.members['1000+005056BF4D75-ttf'], e => 'group.members.'+ e.id, {$unset: {group:''}}));




console.log('search');
console.log(exp.search('*'+ group.name, 'name'));
console.log('in');
console.dir(exp.eql(exp.in(group.managers), 'managers'));


console.log('or');
console.dir(exp.or(1, 'id', {$or: [{b:1}]}));

