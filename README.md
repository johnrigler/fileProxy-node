# fileProxy.js Library

A lightweight JavaScript library to interact with a local `fileProxy` server for reading, writing, listing, and deleting files and directories from a vanilla JS environment.

This library is designed to be imported in a browser or Node.js environment that supports `fetch`.

---

## Installation / Setup

1. Start the `fileProxy` server (must run separately):

```bash
node index.js
```

The server listens on `http://localhost:7799` by default.

2. Include `fileProxy.js` in your project (e.g., in `lib/`):

```html
<script src="lib/fileProxy.js"></script>
```

Or import as a module in Node.js:

```js
const fileProxy = require('./lib/fileProxy.js');
```

---

## Usage

All functions are asynchronous and return promises.

### Write a file

```js
await fileProxy.fileWrite({ hello: "world" }, "data/test.json");

// Or plain text
await fileProxy.fileWrite("Just some text", "data/text.txt");
```

### Read a file

```js
const response = await fileProxy.fileRead("data/test.json");
const data = await response.json(); // if JSON content
console.log(data);
```

> Note: `fileRead` returns a `fetch` Response object. If reading JSON, call `.json()`. For text, call `.text()`.

### List directory contents

```js
const files = await fileProxy.fileList("data");
console.log(files.list); 
// Output: array of { name, type } objects
```

`dirname` is optional; defaults to the root of the `data/` folder.

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

> Directories are removed recursively.

---

## Notes

- All file paths are sandboxed to the `data/` folder for security.  
- The library relies on the local `fileProxy` server. Make sure it is running before calling any functions.  
- `fetch` is used under the hood; ensure your environment supports it (modern browsers or Node.js >=18 with `node-fetch`).  
- All methods are asynchronous, so remember to use `await` or `.then()`.

---

## Example: Full workflow

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

