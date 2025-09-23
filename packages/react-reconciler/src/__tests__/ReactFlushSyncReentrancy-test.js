let React;
let ReactNoop;
let flushSyncWorkOnAllRoots;

describe('ReactFlushSyncReentrancy', () => {
  beforeEach(() => {
    jest.resetModules();

    React = require('react');
    ReactNoop = require('react-noop-renderer');
    ({flushSyncWorkOnAllRoots} = require('react-reconciler/src/ReactFiberRootScheduler'));
  });

  it('defers flushing sync work while commit phase is running', () => {
    const {useLayoutEffect, useState} = React;

    function App() {
      const [step, setStep] = useState(0);

      useLayoutEffect(() => {
        if (step === 0) {
          setStep(1);
          expect(() => flushSyncWorkOnAllRoots()).not.toThrow();
        }
      }, [step]);

      return step;
    }

    expect(() => {
      ReactNoop.flushSync(() => {
        ReactNoop.render(<App />);
      });
    }).not.toThrow();

    expect(ReactNoop.getChildrenAsJSX()).toEqual('1');
  });
});
