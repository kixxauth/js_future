// TODO: real testing

var sys = require('sys')
  , make = require('../lib/emitters/namespaced/notifications').make
  , svc = make()
  , fail = true
  , fail2 = true
  ;

function print(msg) {
    sys.print(msg +'\n');
};

svc.emit('foo.bar', 1);

svc.on('foo.bar.baz', function () {
    print('FAIL: should not be invoked');
});

svc.on('foo.bar', function (x) {
    fail = false;
    if (x !== 1) {
        print('FAIL: param should be 1: '+ x);
    }
});
if (fail) {
    print('FAIL: foo.bar did not execute');
}
fail = true;

svc.on('foo', function (x) {
    fail = false;
    if (x !== 1) {
        print('FAIL: param should be 1: '+ x);
    }
});
if (fail) {
    print('FAIL: foo did not execute');
}
fail = true;

svc = make({});

svc.on('foo.bar.baz', function () {
    print('FAIL: should not be invoked');
});

svc.on('foo.bar', function (x, b) {
    fail = false;
    if (x !== 1) {
        print('FAIL: foo.bar param x should be 1: '+ x);
    }
    if (b !== true) {
        print('FAIL: foo.bar param b should be true: '+ b);
    }
});

svc.on('foo', function (x, b) {
    fail2 = false;
    if (x !== 1) {
        print('FAIL: foo param x should be 1: '+ x);
    }
    if (b !== true) {
        print('FAIL: foo param b should be true: '+ b);
    }
});

svc.emit('foo.bar', [1, true]);

if (fail) {
    print('FAIL: foo.bar did not execute');
}
if (fail2) {
    print('FAIL: foo did not execute');
}

print('done testing namespaced notifications');

