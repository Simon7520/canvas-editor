// 覆盖率  是否覆盖到整个程序
// 覆盖率只是一个衡量的标准 但是不是越高越好 单元测试的话 一般覆盖率都是比较高的
// 集成测试的覆盖率一般比较低

import { flip, sum } from '../../src/tests/coverage.js'
// import { testFunc } from '../../src/tests/coverage2.js'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const expect = require('chai').expect

it('测试flip方法-正', () => {
  expect(flip(true)).to.equal('正')
})

// it('测试flip方法-反', () => {
//   expect(flip(false)).toBe('反')
// })

it('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).to.equal(3)
})
