const bufferJson = require('buffer-json')

function encode(obj, buf, offset = 0) {
  const str = JSON.stringify(obj, bufferJson.replacer)
  if (typeof buf === 'number') {
    offset = buf
    buf = Buffer.alloc(offset + str.length)
  } else if (typeof buf === 'undefined') {
    buf = Buffer.alloc(offset + str.length)
  }
  if (buf.length < offset + str.length) {
    throw new Error('provided buffer is too small')
  }
  buf.write(str, offset, str.length, 'utf8')
  encode.bytes = str.length
  return buf
}

function decode(buf, start, end) {
  start = start || 0
  end = end || buf.length
  const sliced = buf.slice(start, end)
  const str = sliced.toString('utf8')
  decode.bytes = end - start
  return JSON.parse(str, bufferJson.reviver)
}

module.exports = { encode, decode }
