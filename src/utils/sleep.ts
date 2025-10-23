// 비동기 테스트용 함수
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
