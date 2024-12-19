const express = require("express");
const http = require("http");
const QrCode = require("qrcode");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "https://dev.ekcs.co",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
}));

const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
  cors: {
    origin: "https://dev.ekcs.co",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

app.use(express.static("public"));

app.get("/generateBasketballCodeMulti", async (req, res) => {
  const sessionId = uuidv4();
  const urlSession = `https://dev.ekcs.co/FED/QRBasedControlAd/multiple_QR_Control/phoneBasketball/index.html?sessionId=${sessionId}`;

  try {
    const qrCode = await QrCode.toDataURL(urlSession);
    res.send({ qrCode, sessionId });
  } catch (err) {
    res.status(500).send("Generating QR code Error");
  }
});

app.get("/generateSpinWheelCodeMulti", async (req, res) => {
  const sessionId = uuidv4();
  const urlSession = `https://dev.ekcs.co/FED/QRBasedControlAd/multiple_QR_Control/phoneSpinWheel/index.html?sessionId=${sessionId}`;

  try {
    const qrCode = await QrCode.toDataURL(urlSession);
    res.send({ qrCode, sessionId });
  } catch (err) {
    res.status(500).send("Generating QR code Error");
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-session", (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session ${sessionId}`);
  });


  socket.on("scan-qr", (data) => {
    console.log('firstt  ttt  qr type not found');
    const { sessionId , eventType } = data;
    console.log(`QR code scanned for session ${sessionId}, Event-type: ${eventType}`);
    if(!eventType === 'qr1'){
      console.log('qr type not found');
    }
    io.to(sessionId).emit("qr-scanned", { message: "QR code scanned successfully" });
    io.to(sessionId).emit("qr-scannedT", { message: "QR code scanned successfully 2" });
  });

  socket.on("control", (data) => {
    const { sessionId, action } = data;
    console.log(`Action: ${action} for session: ${sessionId}`);
    io.to(sessionId).emit("perform-action", action);
  });
});

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
