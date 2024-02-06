import { Server } from "socket.io";
import { container } from "tsyringe";
import { Client } from "whatsapp-web.js";

export const handleSocketContainer = (server: any) => {
  const io = new Server({
    cors: {
      origin: ["http://localhost:3000", "https://javelyn.vercel.app"],
      methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE", "PROPFIND"],
    },
  });

  container.registerInstance<Server>("SocketServer", io);

  io.on("connection", async (socket) => {
    const companyId = socket.handshake.headers["company-id"];
    const userId = socket.handshake.headers["user-id"];
    if (!companyId || !userId) {
      console.error("Error connecting ws:", socket.id);
      socket.disconnect();
      return;
    }

    socket.join(`ws-room-${companyId}`);
    socket.join(`ws-solo-room-${userId}`);

    const isRegistered = container.isRegistered<Client | string>(
      "zapClient-" + userId
    );
    const client = isRegistered
      ? container.resolve<Client | string>("zapClient-" + userId)
      : undefined;

    let state: string;
    if (!client || typeof client === "string") {
      state = "disconnected";
    } else {
      state = await client.getState();
    }

    if (!client || client === "disconnected" || state === "disconnected") {
      io.to(`ws-solo-room-${userId}`).emit("client-disconnected");
    }
    if (state === "CONNECTED" && typeof client !== "string") {
      io.to(`ws-solo-room-${userId}`).emit("client-ready", {
        name: client?.info.pushname,
        phone: client?.info.me.user,
      });
    }

    if (!state) {
      io.to(`ws-solo-room-${userId}`).emit("client-loading_screen");
    }

    console.log("ws-connected", userId);

    socket.on("disconnectme", async () => {
      socket.disconnect();
      console.log("ws-disconnect", userId);
    });
  });

  io.listen(server);
};
