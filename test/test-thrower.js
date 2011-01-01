// TODO: real testing

var throw_later = require('../lib/thrower').thrower;
throw_later();
throw_later(new Error('Test thrower.'));

require('sys').print('done testing thrower\n');

