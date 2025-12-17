const express = require('express');
const cors = require('cors');
const routes = require('./interfaces/http/routes');
const swaggerDocs = require('./interfaces/http/docs/swagger');
const errorMiddleware = require('./interfaces/http/middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/docs', swaggerDocs.serve, swaggerDocs.setup);
app.use('/api', routes);

app.use(errorMiddleware);

module.exports = app;
