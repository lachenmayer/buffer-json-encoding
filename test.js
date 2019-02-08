const test = require('tape')

const { encode } = require('.')

test('encode basic', t => {
  const buf = encode({ foo: 'bar', baz: Buffer.from('buz') })
  const expected = '{"foo":"bar","baz":{"type":"Buffer","data":"base64:YnV6"}}'
  t.is(buf.toString(), expected)
  t.is(encode.bytes, expected.length)
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
