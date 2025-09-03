const assert = require('assert');

describe('Proxy Server', function() {
  it('should start without throwing', function() {
    // Just try to require the script
    assert.doesNotThrow(() => require('../index.js'));
  });
});

