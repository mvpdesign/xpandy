const configFactory = userConfig => {
  const defaultConfig = {
    container: null,
    items: null,
    autoCloseOnOpen: true,
    arrow: true,
    arrowPosition: 'right',
    callbacks: {
      onInit: () => {},
      onOpen: () => {},
      onClose: () => {},
      onUpdate: () => {}
    }
  };

  // TODO: see if this needs to be saved...
  let configsArray = [];

  const register = element => {
    let newConfig = Object.assign(defaultConfig, userConfig);

    newConfig.container = element;
    configsArray.push(newConfig);

    return newConfig;
  };

  const getConfig = element =>
    configsArray.find(config => config.container === element);

  // TODO: write an update config function

  // Return a function that allows for the easy fetching of the config
  return { getConfig, register };
};

export default configFactory;
