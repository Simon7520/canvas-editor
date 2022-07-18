import {
  timeConsumingFunc,
  timeConsumingFunc2,
  timeConsumingFunc3,
} from '../../src/tests/performance'

import test from 'ava'

test('测试耗时操作-1', t => {
  const res = timeConsumingFunc()
  console.log({ res })
  t.is(res, 1)
})
test('测试耗时操作-2', t => {
  const res = timeConsumingFunc2()
  console.log({ res })
  t.is(res, 2)
})
test('测试耗时操作-3', t => {
  const res = timeConsumingFunc3()
  console.log({ res })
  t.is(res, 3)
})

