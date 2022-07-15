import {
  timeConsumingFunc,
  timeConsumingFunc2,
  timeConsumingFunc3,
  timeConsumingFunc4,
  timeConsumingFunc5
} from '@/tests/performance'

it('测试耗时操作-1', () => {
  const res = timeConsumingFunc()
  console.log({ res })
  expect(res).toBe(1)
})
it('测试耗时操作-2', () => {
  const res = timeConsumingFunc2()
  console.log({ res })
  expect(res).toBe(2)
})
it('测试耗时操作-3', () => {
  const res = timeConsumingFunc3()
  console.log({ res })
  expect(res).toBe(3)
})
it('测试耗时操作-4', () => {
  const res = timeConsumingFunc4()
  console.log({ res })
  expect(res).toBe(4)
})
it('测试耗时操作-5', () => {
  const res = timeConsumingFunc5()
  console.log({ res })
  expect(res).toBe(5)
})
