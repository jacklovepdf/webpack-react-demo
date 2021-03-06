/**
 * Created by chengyong.lin on 17/12/21.
 */

'use strict';
// frame
const express = require('express');
const path = require('path');
const ReactDOMServer = require('react-dom/server');
const fs = require('fs');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
// business
const app = express();

const isDev = process.env.NODE_ENV === "development";

// use web app icon
app.use(favicon(path.join(__dirname, '../../favicon.ico')));
// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded( { extended: false } ));

if(!isDev){
    // 服务器端生产的模版；
    const serverTemplate = require('../../dist/app.server').default; //warning: require module which export
    //客户端的html模版，有带版本号的静态资源
    const clientHtmlString = fs.readFileSync(path.join(__dirname, '../../dist/index.html'), 'utf8');
    //express.static中间件,提供静态资源访问；
    app.use('/public', express.static(path.join(__dirname, '../../dist')));

    app.get('*', function (req, res) {
        const serverHtmlString = ReactDOMServer.renderToString(serverTemplate);

        res.send(clientHtmlString.replace('<server></server>', serverHtmlString));
    });
}else {
    let devStatic = require('./utils/devStatic');
    devStatic(app);
}


app.listen(8088, function () {
    console.log("server is listening on 8088");
});
