const { startServer } = require('./app');

(async () => {
    console.log("starting app...");
    await startServer();
    console.log("app started...");
})();