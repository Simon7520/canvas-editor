import {
  timeConsumingFunc,
  timeConsumingFunc2,
  timeConsumingFunc3,
} from '../../src/tests/performance.js'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expect = require('chai').expect

it('测试耗时操作-1', () => {
  const res = timeConsumingFunc()
  console.log({ res })
  expect(res).to.equal(1)
})
it('测试耗时操作-2', () => {
  const res = timeConsumingFunc2()
  console.log({ res })
  expect(res).to.equal(2)
})
it('测试耗时操作-3', () => {
  const res = timeConsumingFunc3()
  console.log({ res })
  expect(res).to.equal(3)
})
