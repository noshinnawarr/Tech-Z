import { useEffect, useRef, useState } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws';

// Keeps a live WebSocket connection to the backend and exposes the latest
// state snapshot. Reconnects with exponential backoff if the connection drops.
export function useLiveState() {
  const [state, setState] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const retryCountRef = useRef(0);

  useEffect(() => {
    let socket;
    let cancelled = false;
    let retryTimeout;

    function connect() {
      socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        if (cancelled) return;
        setConnected(true);
        retryCountRef.current = 0;
      };

      socket.onmessage = (event) => {
        if (cancelled) return;
        const message = JSON.parse(event.data);
        if (message.type === 'state') {
          setState(message.payload);
          setLastUpdated(new Date());
        }
      };

      socket.onclose = () => {
        if (cancelled) return;
        setConnected(false);
        const delay = Math.min(1000 * 2 ** retryCountRef.current, 10000);
        retryCountRef.current += 1;
        retryTimeout = setTimeout(connect, delay);
      };

      socket.onerror = () => socket.close();
    }

    connect();

    return () => {
      cancelled = true;
      clearTimeout(retryTimeout);
      socket?.close();
    };
  }, []);

  return { state, connected, lastUpdated };
}
