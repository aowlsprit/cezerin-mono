import express from 'express';
import helmet from 'helmet';
import responseTime from 'response-time';
import path from 'path';
import cookieParser from 'cookie-parser';
import winston from 'winston';
import settings from '../../config/server';
// eslint-disable-next-line no-unused-vars
import logger from './logger';
import robotsRendering from './robotsRendering';
import sitemapRendering from './sitemapRendering';
import redirects from './redirects';
import pageRendering from './pageRendering';

const app = express();

const STATIC_PATH = path.join(__dirname, '..', '..', '..', 'cezerin-api', 'public', 'content');

const STATIC_OPTIONS = {
  maxAge: 31536000000 // One year
};

app.set('trust proxy', 1);
app.use(helmet());
app.get('/images/:entity/:id/:size/:filename', (req, res, next) => {
  // A stub of image resizing (can be done with Nginx)
  const newUrl = `/images/${req.params.entity}/${req.params.id}/${req.params.filename}`;
  req.url = newUrl;
  next();
});

app.use(express.static(STATIC_PATH, STATIC_OPTIONS));

app.use('/assets', express.static('../cezerin-theme/assets', STATIC_OPTIONS));
app.use('/sw.js', express.static('../cezerin-theme/assets/sw.js'));

app.get(/^.+\.(jpg|jpeg|gif|png|bmp|ico|webp|svg|css|js|zip|rar|flv|swf|xls)$/, (req, res) => {
  res.status(404).end();
});
app.get('/robots.txt', robotsRendering);
app.get('/sitemap.xml', sitemapRendering);
app.get('*', redirects);
app.use(responseTime());
app.use(cookieParser(settings.cookieSecretKey));
app.get('*', pageRendering);

const server = app.listen(settings.storeListenPort, () => {
  const serverAddress = server.address();
  winston.info(`Store running at http://localhost:${serverAddress.port}`);
});