// TODO: real testing

var throw_later = require('../lib/thrower').raise;
throw_later();
throw_later(new Error('Test thrower.'));

require('sys').print('done testing thrower\n');

