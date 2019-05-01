// index.js

/*eslint-disable no-console*/

const app = require('./src/app');
const settings =require('./src/settings');

app.listen(settings.apiServerPort, () => {
  console.info(`Running on port ${settings.apiServerPort}`);
});
