const { createServer } = require("http");

const { app } = require("./src/app");

const port = process.env.PORT || 5000;

const server = createServer(app);

server.listen(port);

server.on("listening", () => console.log(`Server is running at port ${port}`));
server.on("error", console.log);
