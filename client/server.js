const proxy = require('http-proxy-middleware');
const Bundler = require('parcel-bundler');
const express = require('express');

const bundler = new Bundler('./public/index.html');
const app = express();
let p = `${process.env.URL || 'http://localhost'}:${process.env.API_PORT || 5000}`
app.use('/api',
    proxy({
        target: p
    })
);

app.use(bundler.middleware());
console.log('proxy set to ' + p);
app.listen(Number(process.env.PORT || 3000));