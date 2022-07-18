import {
  timeConsumingFunc,
  timeConsumingFunc2,
  timeConsumingFunc3,
} from '../../src/tests/performance'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const test = require('tape')

test('测试耗时操作-1', (t: any) => {
  t.plan(1)
  const res = timeConsumingFunc()
  console.log({ res })
  t.equal(res, 1)
  t.end()
})
test('测试耗时操作-2', (t: any) => {
  t.plan(1)
  const res = timeConsumingFunc2()
  console.log({ res })
  t.equal(res, 2)
  t.end()
})
test('测试耗时操作-3', (t: any) => {
  t.plan(1)
  const res = timeConsumingFunc3()
  console.log({ res })
  t.equal(res, 3)
  t.end()
})

