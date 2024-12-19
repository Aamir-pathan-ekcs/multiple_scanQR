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
 const eventType = "qr1";
  try {
    const qrCode = await QrCode.toDataURL(urlSession);
    res.send({ qrCode, eventType, sessionId });
  } catch (err) {
    res.status(500).send("Generating QR code Error");
  }
});

app.get("/generateSpinWheelCodeMulti", async (req, res) => {
  const sessionId = uuidv4();
  const urlSession = `https://dev.ekcs.co/FED/QRBasedControlAd/multiple_QR_Control/phoneSpinWheel/index.html?sessionId=${sessionId}`;
  const eventType = "qr2";
  try {
    const qrCode = await QrCode.toDataURL(urlSession);
    res.send({ qrCode, eventType, sessionId});
  } catch (err) {
    res.status(500).send("Generating QR code Error");
  }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join-session", ({ eventType, sessionId }) => {
    console.log(`Received join-session for session ${sessionId} with eventType ${eventType}`);
    socket.join(sessionId);
    activeSessions[sessionId] = { eventType };
  });


  socket.on("scan-qr", (data = {}) => {
    console.log('we are data is fetching');
    console.log(data);
    const { sessionId } = data;
    const session = activeSessions[sessionId];

    // Check if eventType exists for the session
    if (session && session.eventType) {
      const { eventType } = session; // Retrieve stored eventType from activeSessions
      console.log(`QR code scanned for session ${sessionId}, Event-type: ${eventType}`);

      if (eventType === 'qr1') {
        io.to(sessionId).emit("qr-scanned", { message: "QR code scanned successfully" });
      } else if (eventType === 'qr2') {
        io.to(sessionId).emit("qr-scannedT", { message: "QR code scanned successfully 2" });
      } else {
        console.log("Unknown eventType:", eventType);
      }
    } else {
      console.log(`No eventType found for session ${sessionId}`);
    }
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
