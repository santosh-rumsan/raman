import { useEffect } from 'react';
import { useWebSocket } from '../context/WebSocketContext';

export function useWebSocketEvent(
  eventName: string,
  callback: (data: any) => void
) {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket && eventName) {
      socket.on(eventName, callback);

      return () => {
        socket.off(eventName, callback);
      };
    }
  }, [socket, eventName, callback]);
}
