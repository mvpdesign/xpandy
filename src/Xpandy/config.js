const configFactory = userConfig => {
  const defaultConfig = {
    container: null,
    items: null,
    autoCloseOnOpen: true,
    equalHeights: false,
    arrow: true,
    arrowPosition: 'right',
    previewTemplate: config => `
        <div class="Xpandy-wrapper">
            ${config.arrow ? '<div class="Xpandy-arrow"></div>' : ''}
            <div class="Xpandy-container">
                <div class="Xpandy-innerContainer">
                    <div class="Xpandy-body">
                        <div class="Xpandy-close--wrapper">
                            <span class="Xpandy-close"></span>
                        </div>
                        <div class="Xpandy-base"></div>
                    </div>
                </div>
            </div>
        </div>
        `,
    callbacks: {
      onInit: state => {},
      onOpen: (item, state) => {},
      onClose: (item, state) => {},
      onUpdate: (item, state) => {}
    }
  };

  // ------------------------------------------------

  let configsArray = [];

  const register = element => {
    let newConfig = Object.assign(defaultConfig, userConfig);

    newConfig.container = element;
    configsArray.push(newConfig);

    return newConfig;
  };

  const getConfig = element => configsArray.find(config => config.container === element);

  // TODO: write an update config function

  // Return a function that allows for the easy fetching of the config
  return { getConfig, register };
};

export default configFactory;
