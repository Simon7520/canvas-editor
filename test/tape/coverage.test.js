// 覆盖率  是否覆盖到整个程序
// 覆盖率只是一个衡量的标准 但是不是越高越好 单元测试的话 一般覆盖率都是比较高的
// 集成测试的覆盖率一般比较低

import { flip, sum } from '../../src/tests/coverage.js'
import { testFunc } from '../../src/tests/coverage2'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const test = require('tape')

test('测试flip方法-正', t => {
  t.plan(1)
  t.equal(flip(true), '正')
  t.end()
})

// it('测试flip方法-反', () => {
//   expect(flip(false)).toBe('反')
// })

test('adds 1 + 2 to equal 3', t => {
  t.plan(1)
  t.equal(sum(1, 2), 3)
  t.end()
})

// test Error handling
test('test func Error', t => {
  t.plan(1)
  t.equal(testFunc(1), 2)
  t.end()
})
