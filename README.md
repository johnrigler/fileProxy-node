# File Proxy Server

A simple Node.js HTTP proxy to read and write to the local filesystem.

## Installation
```bash
git clone https://github.com/johnrigler/fileProxy-node.git
cd fileProxy-node 
npm install

## To Use

Copy the "lib" directory into your place where your local webserver can see it, then load into  
your local "vanilla" javascript environment. 

# FileProxy

A simple local HTTP proxy for reading, writing, listing, and deleting files and directories. Built with Node.js, supports CORS, and can be used programmatically or via HTTP requests.

---

## Installation

```bash
git clone https://github.com/yourusername/fileproxy.git
cd fileproxy
npm install
```

---

## Running the server

```bash
node index.js
```

The server listens on **http://localhost:7799** by default.  

---

## Endpoints

All endpoints accept **POST** requests with JSON payloads. CORS is enabled.

---

### 1. Create Directory (`/mkdir`)

**Request**

```json
POST /mkdir
Content-Type: application/json

{
  "dirname": "myfolder"
}
```

**Response**

```json
{
  "created": "myfolder"
}
```

---

### 2. Remove Directory (`/rmdir`)

**Request**

```json
POST /rmdir
Content-Type: application/json

{
  "dirname": "myfolder"
}
```

**Response**

```json
{
  "removed": "myfolder"
}
```

---

### 3. List Directory (`/list`)

**Request**

```json
POST /list
Content-Type: application/json

{
  "dirname": "myfolder"
}
```

**Response**

```json
{
  "dirname": "myfolder",
  "list": [
    { "name": "file1.json", "type": "file" },
    { "name": "subfolder", "type": "dir" }
  ]
}
```

---

### 4. Save File (`/save`)

**Request**

```
POST /save?filename=myfolder/test.json
Content-Type: application/json

{
  "hello": "world"
}
```

**Response**

```json
{
  "saved": "myfolder/test.json"
}
```

---

### 5. Load File (`/load`)

**Request**

```json
POST /load
Content-Type: application/json

{
  "filename": "myfolder/test.json"
}
```

**Response**

```json
{
  "hello": "world"
}
```

---

### 6. Delete File or Directory (`/delete`)

**Request**

```json
POST /delete
Content-Type: application/json

{
  "filename": "myfolder/test.json"
}
```

**Response**

```json
{
  "deleted": "myfolder/test.json"
}
```

---

## Programmatic Usage

You can also import the server into another Node.js module (e.g., for testing):

```js
const server = require('./index');

// start on random port
const testServer = server.listen(0, () => {
  const port = testServer.address().port;
  console.log('Server running on port', port);
});
```

---

## Testing

Tests use [Mocha](https://mochajs.org/) and [Supertest](https://www.npmjs.com/package/supertest):

```bash
npm install --save-dev mocha supertest
npm test
```

---

## Notes

- File paths are **sandboxed** to the `data/` folder by default.  
- CORS headers allow cross-origin requests.  
- `/rmdir` and `/delete` use `fs.rm` to avoid Node.js deprecation warnings.  

