const server = require("http").createServer();
const io = require("socket.io")();
io.attach(server, {
  pingInterval: 10000,
  pingTimeout: 5000,
  cookie: false,
  cors: {
    origin: "http://localhost:3000",
    credentials: false,
  },
});

var rooms = {};

io.on("connection", (socket) => {
  console.log("connected ", socket.id);
  socket.on("join-room", (roomId, userName) => {
    socket.join(roomId);
    console.log(roomId, userName);
    rooms[roomId] = [userName];
  });

  socket.on("join-friend", (roomId, userName) => {
    socket.join(roomId);
    console.log(roomId, userName);
    rooms[roomId].push(userName);
    io.to(roomId).emit("friend-joined", rooms[roomId]);
  });
  socket.on("move",({roomId,rowIndex,cellIndex})=>{
    console.log(roomId,rowIndex,cellIndex);
    socket.broadcast.to(roomId).emit("friend-move", {rowIndex,cellIndex});
  })

});

server.listen(3002);
