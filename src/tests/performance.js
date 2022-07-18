// import { exec } from 'child_process'

export const timeConsumingFunc = () => {
  // exec('sleep 2000', (error, stdout, stderr) => {
  //   console.log(({ error, stdout, stderr }))
  //   res = { status: 1, error, stdout, stderr }
  // })
  let startTime = new Date().getTime() + 1 * 1000
  while (new Date().getTime() < startTime) {
    // do nothing, only for time consume
  }
  return 1
}

export const timeConsumingFunc2 = () => {

  let startTime = new Date().getTime() + 1 * 1000
  while (new Date().getTime() < startTime) {
    // do nothing, only for time consume
  }
  return 2
}

export const timeConsumingFunc3 = () => {

  let startTime = new Date().getTime() + 1 * 1000
  while (new Date().getTime() < startTime) {
    // do nothing, only for time consume
  }
  return 3
}

export const timeConsumingFunc4 = () => {

  let startTime = new Date().getTime() + 1 * 1000
  while (new Date().getTime() < startTime) {
    // do nothing, only for time consume
  }
  return 4
}

export const timeConsumingFunc5 = () => {

  let startTime = new Date().getTime() + 1 * 1000
  while (new Date().getTime() < startTime) {
    // do nothing, only for time consume
  }
  return 5
}
