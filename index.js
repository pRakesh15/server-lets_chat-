import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { config } from "dotenv";
config();
const port=process.env.port;
const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server);
const users = [{}];

app.get("/", (req, res) => {
  res.send("hy this is socket io");
});

io.on("connect", socket => {
  socket.on("joined", ({ user }) => {
    users[socket.id] = user;
    socket.emit("wellcome", {
      user: "Admin",
      message: `wellcome to the chat ,${users[socket.id]} ! `,
    })
    socket.broadcast.emit("userJoin", {
      user: "Admin",
      message: `${users[socket.id]} has joined`,
    });
   
  });

  

  socket.on("message", ({ message, id }) => {
    io.emit("sendMessage", { user: users[socket.id], message, id });
  });

  socket.on("disconnectt", () => {

    socket.broadcast.emit("leave", {
      user: "Admin",
      message: `${users[socket.id]} has left the chat`,
    });
  });
});

server.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
