var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000;

app.use(express.static('app/www'));

app.listen(port, function(){
    console.log('server started at http://localhost:' + port);
});
