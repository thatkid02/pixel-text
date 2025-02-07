/** @type {import('jest').Config} */
export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__mocks__/canvasMock.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
}; 