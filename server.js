var express = require('express'),
    api = require('./app/api'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('app/www'));

app.get('/api/:competition', api.delegate);

app.listen(port, function(){
    console.log('server started at http://localhost:' + port);
});
