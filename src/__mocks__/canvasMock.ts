export const createCanvasMock = () => {
  const canvas = {
    getContext: jest.fn(() => ({
      fillStyle: '',
      font: '',
      textBaseline: '',
      textAlign: '',
      fillText: jest.fn(),
      clearRect: jest.fn(),
      measureText: jest.fn(() => ({ width: 10 })),
      getImageData: jest.fn(() => ({
        data: new Uint8ClampedArray(100).fill(255)
      }))
    })),
    width: 0,
    height: 0
  };
  return canvas;
};

// Mock document.createElement
document.createElement = jest.fn((tagName) => {
  if (tagName === 'canvas') {
    return createCanvasMock();
  }
  return null;
}) as any; 