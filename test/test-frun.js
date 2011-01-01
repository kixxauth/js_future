// TODO: real testing

var run = require('../lib/frun').run;

run();
run(function () {});
run(function () {}, [1,2,3]);
run(function () {}, [1,2,3], this);

require('sys').print('done testing frun\n');

