var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var http = require('http');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const io = require("socket.io")();
var cors = require('cors');
var app = express();
app.use(cors());
// view engine setup
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
var server = http.createServer(app);
io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
    cors: {
      origin: "http://localhost:3000",
      credentials: false
    }
});

var rooms = {};

io.on('connection',(socket)=>{
 socket.on('join-room',(roomId,userName)=>{
    socket.join(roomId);
    rooms[roomId] = [userName];
 })

 socket.on('join-friend',(roomId, userName)=>{
  socket.join(roomId);
  rooms[roomId].push(userName);
  io.to(roomId).emit('friend-joined', rooms[roomId]);
 })
//  socket.on("start-game",(roomId,userName)=>{
//   socket.broadcast.to(roomId).emit('game-started', userName);
//  })
})
server.listen(3002);
