// TODO: real testing

var enqueue = require('../lib/enqueue');

enqueue.dequeue(enqueue.queue(function () {}));

require('sys').print('done testing enqueue\n');

