var test = require('tape');

test('timing test', function (t) {
  t.plan(2);

  // console.log('hello')

  t.equal(typeof Date.now, 'function');
  var start = Date.now();

  setTimeout(function () {
    t.equal(Date.now() - start, 100);
  }, 100);
});
