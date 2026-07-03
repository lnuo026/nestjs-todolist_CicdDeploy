import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

/**
 * 把 .toBeInTheDocument() 这类断言"注册"到
  vitest 的 expect() 上。因为在第2步的配置里指
  定了setupFiles，vitest会在跑每个测试文件之前，
  先自动执行这个文件一次。


    cleanup() 是 @testing-library/react
  提供的函数，作用是卸载所有通过 render() 
  渲染过的组件、清空 document.body。放在
  setup.ts（你已经在 vite.config.ts 里配置了
  setupFiles）里写一次，之后所有测试文件的每个测试之间都
  会自动执行，不用每个测试文件自己重复写。
 */
