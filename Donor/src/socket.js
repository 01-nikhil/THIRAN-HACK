const SOCKET_URL = "ws://192.168.221.137:5000";
  // Change to actual IP

let socket;

export const connectWebSocket = () => {
    if (!socket) {
        socket = new WebSocket(SOCKET_URL);

        socket.onopen = () => console.log("Connected to WebSocket");
        socket.onmessage = (event) => {
            console.log("Received update:", event.data);
        };
        socket.onclose = () => console.log("Disconnected from WebSocket");
    }
};

export const sendWebSocketMessage = (message) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
    }
};
