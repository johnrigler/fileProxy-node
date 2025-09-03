const assert = require('assert');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const server = require('../fileProxy_server'); // adjust path if needed

const DATA_ROOT = path.join(__dirname, '../data'); // same as in your server

describe('Proxy Server', function() {
  it('should start without throwing', function() {
    // Just try to require the script
    assert.doesNotThrow(() => require('../fileProxy_server.js'));
  });
});

describe('File Proxy', function() {
  let testServer;
  let baseUrl;

  before(done => {
    // start server on random port
    testServer = server.listen(0, () => {
      const port = testServer.address().port;
      baseUrl = `http://localhost:${port}`;
      done();
    });
  });

  after(done => {
    testServer.close(done);
  });

  const testDir = 'testdir';
  const testFile = 'testdir/testfile.json';
  const fileContent = { hello: 'world' };

  it('should create a directory (/mkdir)', function(done) {
    request(baseUrl)
      .post('/mkdir')
      .send(JSON.stringify({ dirname: testDir }))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (!res.body.created || res.body.created !== testDir) throw new Error('Directory not created');
      })
      .end(done);
  });

  it('should save a file (/save)', function(done) {
    request(baseUrl)
      .post(`/save?filename=${encodeURIComponent(testFile)}`)
      .set('Content-Type', 'application/json')
      .send(JSON.stringify(fileContent))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (!res.body.saved || res.body.saved !== testFile) throw new Error('File not saved');
      })
      .end(done);
  });

  it('should list directory contents (/list)', function(done) {
    request(baseUrl)
      .post('/list')
      .send(JSON.stringify({ dirname: testDir }))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        const names = res.body.list.map(f => f.name);
        if (!names.includes('testfile.json')) throw new Error('File not listed');
      })
      .end(done);
  });

  it('should load a file (/load)', function(done) {
    request(baseUrl)
      .post('/load')
      .send(JSON.stringify({ filename: testFile }))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (res.body.hello !== 'world') throw new Error('File content mismatch');
      })
      .end(done);
  });

  it('should remove a directory (/rmdir)', function(done) {
    request(baseUrl)
      .post('/rmdir')
      .send(JSON.stringify({ dirname: testDir }))
      .expect('Content-Type', /json/)
      .expect(200)
      .expect(res => {
        if (!res.body.removed || res.body.removed !== testDir) throw new Error('Directory not removed');
        if (fs.existsSync(path.join(DATA_ROOT, testDir))) throw new Error('Directory still exists');
      })
      .end(done);
  });
});


