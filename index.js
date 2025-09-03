const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

const proxy = httpProxy.createProxyServer({});
const DATA_ROOT = path.join(__dirname, 'data');

function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function safePath(p) {
  const resolved = path.normalize(path.join(DATA_ROOT, p));
  if (!resolved.startsWith(DATA_ROOT)) throw new Error('Invalid path');
  return resolved;
}

server = http.createServer((req, res) => {
  if (req.method === 'OPTIONS') {
    setCORS(res);
    res.writeHead(200);
    return res.end();
  }

  if (req.method === 'POST' && req.url === '/load') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { filename } = JSON.parse(body);
        if (!filename || typeof filename !== 'string') throw new Error('Missing filename');
        const filePath = safePath(filename);
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: `File not found: ${filename}` }));
          }
          try {
            const json = JSON.parse(data);
            res.writeHead(200, { 'Content-Type': 'application/json' });
        //    res.end(JSON.stringify({ loaded: filename, data: json }));
            res.end(JSON.stringify( json ));

          } catch (e) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(data);
          }
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

if (req.method === 'POST' && req.url.startsWith('/save')) {
  setCORS(res);

  const urlParts = new URL(req.url, `http://${req.headers.host}`);
  const filename = urlParts.searchParams.get('filename');

  if (!filename || typeof filename !== 'string') {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Missing filename' }));
  }

  const filePath = safePath(filename);
  let body = '';

  req.on('data', chunk => (body += chunk));
  req.on('end', () => {
    try {
      let contentToWrite = body;

      // Normalize based on content-type
      const ct = req.headers['content-type'] || '';
      if (ct.includes('application/json')) {
        try {
          const parsed = JSON.parse(body);
          // Pretty-print JSON before saving
          contentToWrite = JSON.stringify(parsed, null, 2);
        } catch (e) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      }

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFile(filePath, contentToWrite, 'utf8', err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Write failed' }));
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ saved: filename }));
      });
    } catch (e) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: e.message }));
    }
  });

  return;
}


  if (req.method === 'POST' && req.url === '/list') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        const dirPath = safePath(dirname || '.');
        fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
          if (err) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Directory not found' }));
          }
          const list = files.map(f => ({ name: f.name, type: f.isDirectory() ? 'dir' : 'file' }));
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ dirname, list }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/delete') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { filename } = JSON.parse(body);
        if (!filename || typeof filename !== 'string') throw new Error('Missing filename');
        const filePath = safePath(filename);
        fs.rm(filePath, { recursive: true, force: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Delete failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ deleted: filename }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/mkdir') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        if (!dirname || typeof dirname !== 'string') throw new Error('Missing dirname');
        const dirPath = safePath(dirname);
        fs.mkdir(dirPath, { recursive: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Mkdir failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ created: dirname }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

// Remove directory
  if (req.method === 'POST' && req.url === '/rmdir') {
    setCORS(res);
    let body = '';
    req.on('data', c => (body += c));
    req.on('end', () => {
      try {
        const { dirname } = JSON.parse(body);
        if (!dirname || typeof dirname !== 'string') throw new Error('Missing dirname');
        const dirPath = safePath(dirname);
        fs.rm(dirPath, { recursive: true, force: true }, err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Rmdir failed' }));
          }
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ removed: dirname }));
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

});

if (require.main === module) {
  server.listen(7799, () => {
    console.log('fileproxy listening on http://localhost:7799');
  });
}

module.exports = server;

//.listen(7799, () => {
//  console.log('fileproxy listening on http://localhost:7799');
//});

