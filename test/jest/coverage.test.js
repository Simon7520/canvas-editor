/*
 * @Author: Simon
 * @Date: 2022-07-15 15:50:19
 * @LastEditors: Simon
 * @LastEditTime: 2022-07-18 15:06:16
 * @Description: 
 */
// 覆盖率  是否覆盖到整个程序
// 覆盖率只是一个衡量的标准 但是不是越高越好 单元测试的话 一般覆盖率都是比较高的
// 集成测试的覆盖率一般比较低

import { flip, sum } from '@/tests/coverage.js'
import { testFunc } from '@/tests/coverage2'

it('测试flip方法-正', () => {
  expect(flip(true)).toBe('正')
})

// it('测试flip方法-反', () => {
//   expect(flip(false)).toBe('反')
// })

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

// test Error handling
test('test func Error', () => {
  expect(testFunc(1)).toBe(2)
})
