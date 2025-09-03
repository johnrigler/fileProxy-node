# FileProxy Project

A local HTTP proxy for file operations and a JavaScript library for programmatic access.  

This project has two components:  

1. **Server** (`fileProxy_server.js`) – runs a local HTTP server exposing endpoints to read, write, list, and delete files/directories.  
2. **Client Library** (`lib/fileProxy.js`) – vanilla JavaScript functions to interact with the server programmatically. All functionality exposed under "fileProxy" object.

---

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/fileproxy.git
cd fileproxy
npm install
```

---

## Running the Server

```bash
node fileProxy_server.js
```

The server listens on **http://localhost:7799** by default.  

---

## Server Endpoints

All endpoints accept **POST** requests with JSON payloads. CORS is enabled.

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

### 2. Remove Directory (`/rmdir`)

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

### 3. List Directory (`/list`)

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

### 4. Save File (`/save`)

```json
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

### 5. Load File (`/load`)

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

### 6. Delete File or Directory (`/delete`)

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

## Programmatic Server Usage

```js
const server = require('./index');

// Start on a random port
const testServer = server.listen(0, () => {
  console.log('Server running on port', testServer.address().port);
});
```

---

## Testing Server

Tests use [Mocha](https://mochajs.org/) and [Supertest](https://www.npmjs.com/package/supertest):

```bash
npm install --save-dev mocha supertest
npm test
```

---

## Notes on Server

- File paths are sandboxed to the `data/` folder.  
- CORS headers allow cross-origin requests.  
- `/rmdir` and `/delete` use `fs.rm` to avoid Node.js deprecation warnings.

---

## Client Library (`lib/fileProxy.js`)

Vanilla JS functions to interact with the server. All functions are asynchronous.

---

### Write a file

```js
await fileProxy.fileWrite({ hello: "world" }, "data/test.json");
// Or plain text
await fileProxy.fileWrite("Just some text", "data/text.txt");
```

### Read a file

```js
const response = await fileProxy.fileRead("data/test.json");
const data = await response.json(); // for JSON
console.log(data);
```

### List directory contents

```js
const files = await fileProxy.fileList("data");
console.log(files.list); 
```

### Delete a file

```js
await fileProxy.fileDelete("data/test.json");
```

### Create a directory

```js
await fileProxy.mkDir("data/newFolder");
```

### Remove a directory

```js
await fileProxy.rmDir("data/newFolder");
```

### Access an image file remotely from data/images

```js
const img = document.createElement('img');
img.src = `http://localhost:7799/image?file=${encodeURIComponent("images/decoy.jpeg")}`;
document.body.appendChild(img);

```

---

## Example Workflow with Library

```js
await fileProxy.mkDir("data/example");
await fileProxy.fileWrite({ test: 123 }, "data/example/test.json");

const files = await fileProxy.fileList("data/example");
console.log(files);

const fileData = await fileProxy.fileRead("data/example/test.json");
console.log(await fileData.json());

await fileProxy.fileDelete("data/example/test.json");
await fileProxy.rmDir("data/example");
```

---

## Client-Side example

Put the example and required library in HTML path to see a live example, or
visit https://johnrigler.github.io/fileProxy 

(Note, this page only works if you are running the node proxy.)

---

## Notes on Library

- Relies on the local `fileProxy` server. Make sure it is running before calling functions.  
- All methods are asynchronous; use `await` or `.then()`.  
- File paths are sandboxed to the `data/` folder for security.  

