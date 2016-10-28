let a = {};
let b = e => 'id';
let c = e => 'd';


a[b] = 1;
a[c] = 2;
console.log(a);

if (a[b])
	console.log(1);