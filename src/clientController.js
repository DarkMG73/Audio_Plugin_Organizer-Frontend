const ipcExchange = (command: any, data: any) => {
  const message =
    'There was an error trying to retrieve data. Please try again.\n\nIf the problem continues, please report error "CC-Com" this to: mike@glassinteracrtive.com';
  const errorObject = {
    data: {
      message,
    },
    message,
    code: 524,
    description: 'A Timeout Occurred',
    status: 524,
  };

  window.electron.ipcRenderer.sendMessage(command, data);

  const res = new Promise((resolve) => {
    const timeLimit = setTimeout(() => resolve(errorObject), 10000);

    window.electron.ipcRenderer.once(command, (arg) => {
      // eslint-disable-next-line no-console
      const groomedOutput = typeof arg === 'string' ? JSON.parse(arg) : false;

      clearTimeout(timeLimit);
      resolve(groomedOutput);
    });

    // if (timeLimitExceeded) reject(errorObject);
  });

  return res;
};

export default ipcExchange;
