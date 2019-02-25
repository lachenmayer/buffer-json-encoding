const test = require('tape')

const { encode, decode, encodingLength } = require('.')

test('encode basic', t => {
  const buf = encode({ foo: 'bar', baz: Buffer.from('buz') })
  const expected = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  t.is(buf.toString(), expected)
  t.is(encode.bytes, expected.length)
  t.end()
})

test('encode utf8', t => {
  const buf = encode({ mood: '🤙', moji: Buffer.from('🤙') })
  const expected =
    '{"mood":"🤙","moji":{"type":"Buffer","data":"base64:8J+kmQ=="}}'
  t.is(buf.toString(), expected)
  t.is(encode.bytes, Buffer.byteLength(expected, 'utf8'))
  t.end()
})

test('encode with given buffer', t => {
  const buf = Buffer.alloc(100)
  const encoded = encode({ foo: 'bar', baz: Buffer.from('buz') }, buf)
  t.is(buf, encoded)
  const expected = Buffer.alloc(100)
  expected.write(
    '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}',
    0
  )
  t.deepEqual(buf, expected)
  t.end()
})

test('encode with too small buffer', t => {
  const buf = Buffer.alloc(3)
  t.throws(() => encode({ foo: 'bar', baz: Buffer.from('buz') }, buf))
  t.end()
})

test('encode with offset', t => {
  const encoded = encode({ foo: 'bar', baz: Buffer.from('buz') }, 8)
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  const expected = Buffer.alloc(8 + str.length)
  expected.write(
    '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}',
    8
  )
  t.deepEqual(encoded, expected)
  t.end()
})

test('encode with buffer & offset', t => {
  const buf = Buffer.alloc(100)
  const encoded = encode({ foo: 'bar', baz: Buffer.from('buz') }, buf, 8)
  t.is(buf, encoded)
  const expected = Buffer.alloc(100)
  expected.write(
    '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}',
    8
  )
  t.deepEqual(buf, expected)
  t.end()
})

test('decode basic', t => {
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  const buf = Buffer.from(str)
  const decoded = decode(buf)
  t.deepEqual(decoded, { foo: 'bar', baz: Buffer.from('buz') })
  t.is(decode.bytes, str.length)
  t.end()
})

test('decode utf8', t => {
  const str = '{"mood":"🤙","moji":{"type":"Buffer","data":"base64:8J+kmQ=="}}'
  const buf = Buffer.from(str)
  const decoded = decode(buf)
  t.deepEqual(decoded, { mood: '🤙', moji: Buffer.from('🤙') })
  t.is(decode.bytes, Buffer.byteLength(str, 'utf8'))
  t.end()
})

test('decode array', t => {
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":[98,117,122]}}'
  const buf = Buffer.from(str)
  const decoded = decode(buf)
  t.deepEqual(decoded, { foo: 'bar', baz: Buffer.from('buz') })
  t.is(decode.bytes, str.length)
  t.end()
})

test('decode start', t => {
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  const buf = Buffer.alloc(str.length + 8)
  buf.write(str, 8)
  const decoded = decode(buf, 8)
  t.deepEqual(decoded, { foo: 'bar', baz: Buffer.from('buz') })
  t.end()
})

test('decode start + end', t => {
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  const buf = Buffer.alloc(100)
  buf.write(str, 8)
  const decoded = decode(buf, 8, str.length + 8)
  t.deepEqual(decoded, { foo: 'bar', baz: Buffer.from('buz') })
  t.end()
})

test('encoding length', t => {
  const str = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  t.is(encodingLength({ foo: 'bar', baz: Buffer.from('buz') }), str.length)
  t.end()
})
