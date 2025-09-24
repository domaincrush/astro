import { useEffect, useRef, useState, useCallback } from 'react';

export default function useWebSocket(url: string | null, onMessage?: (data: any) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const onMessageRef = useRef(onMessage);

  // Update the ref when onMessage changes
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    // WebSocket disabled - using Socket.IO for real-time communication
    setIsConnected(false);
  }, [url]);

  const sendMessage = useCallback((data: any) => {
    // WebSocket disabled - messages handled by Socket.IO
    return false;
  }, []);

  return {
    isConnected,
    sendMessage,
  };
}
