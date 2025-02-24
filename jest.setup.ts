if (typeof global.structuredClone !== 'function') {
    // This is a basic polyfill fir structuredClone
    global.structuredClone = (value: any) =>
      value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    });
}
