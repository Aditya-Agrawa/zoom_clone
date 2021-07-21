var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { v4: uuidV4 } = require('uuid')
var app = express();
var http = require('http');
let server = http.createServer(app);
var ExpressPeerServer = require('peer').ExpressPeerServer;
console.log("hello")
var options = {
    debug: true
}

app.use('/peerjs', ExpressPeerServer(server, options));
//const server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 5000);

io.on('connection', socket => {

    socket.on('room', (roomID, userId) => {
        // console.log(roomID);
        socket.join(roomID);
        socket.to(roomID).emit('user-connected', userId);
        socket.on('message', (message) => {
            //send message to the same room
            io.in(roomID).emit('createMessage', message);
        });
        socket.on('disconnect', () => {
            socket.to(roomID).emit('user-disconnected', userId)
        })
    });

})



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { Socket } = require('dgram');



// view engine setuphjhg
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;