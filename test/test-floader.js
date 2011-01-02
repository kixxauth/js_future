// TODO: real testing

var sys = require('sys')
  , make = require('../lib/floader').make
  , factory
  ;

function print(msg) {
    sys.print(msg +'\n');
};

make('try { '+
     'print("ok");'+
     'require("sys").print("FAIL: floader print undefined");'+
     '} catch (e) {}')();

make('try { '+
     'print("floader ok");'+
     '} catch (e) {'+
     'require("sys").print("FAIL: floader print injected");'+
     '}')({print: print});

print('done testing floader');

