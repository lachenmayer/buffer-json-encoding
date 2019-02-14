# buffer-json-encoding

[![abstract-encoding](https://img.shields.io/badge/abstract--encoding-compliant-brightgreen.svg?style=flat)](https://github.com/mafintosh/abstract-encoding)

An [`abstract-encoding`](https://github.com/mafintosh/abstract-encoding) compatible JSON encoder/decoder that properly encodes/decodes buffers.

The reason this module exists is that JSON does not have a built-in data type for binary data, so Node.js by default encodes a buffer as an object of shape `{ type: "Buffer", data: [...] }`. The issue is that Node.js does not decode these objects as Buffer instances, which is not very useful if you actually want to do something with them.

This module depends on [`buffer-json`](https://www.npmjs.com/package/@lachenmayer/buffer-json) which provides a [_replacer_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#The_replacer_parameter) & [_reviver_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse) for use with `JSON.stringify` & `JSON.parse` respectively. Buffer data is encoded as a base64-encoded string, rather than as an array of numbers. Buffers are decoded as expected with both (base-64 & array) encodings.

## API

```
buffer = encode(obj, [buffer], [offset])
obj = decode(buf, [start], [end])
number = encodingLength(obj)
```

See [`abstract-encoding`](https://github.com/mafintosh/abstract-encoding) for more details.

