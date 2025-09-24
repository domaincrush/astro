import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export default function useSocket(consultationId: number | null, onMessage?: (data: any) => void) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!consultationId) return;

    // Initialize socket connection
    socketRef.current = io({
      path: '/socket.io/',
      autoConnect: true,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket.IO connected:', socket.id);
      // Join the consultation room
      socket.emit('join-consultation', consultationId);
    });

    socket.on('disconnect', () => {
      console.log('Socket.IO disconnected');
    });

    socket.on('new-message', (messageData) => {
      console.log('🔗 Socket.IO received new-message:', messageData);
      console.log('🔗 Message structure:', Object.keys(messageData));
      if (onMessage) {
        // Pass the message directly without wrapping it in a type
        onMessage(messageData);
      }
    });

    socket.on('session-extended', (extensionData) => {
      if (onMessage) {
        onMessage({
          type: 'session-extended',
          data: extensionData
        });
      }
    });

    socket.on('typing-start', (data) => {
      if (onMessage) {
        onMessage({
          type: 'typing-start',
          data
        });
      }
    });

    socket.on('typing-stop', (data) => {
      if (onMessage) {
        onMessage({
          type: 'typing-stop',
          data
        });
      }
    });

    socket.on('message-read', (data) => {
      if (onMessage) {
        onMessage({
          type: 'message-read',
          messageId: data.messageId
        });
      }
    });

    // Session timeout events
    socket.on('session-warning', (data) => {
      console.log('⚠️ Session warning received:', data);
      if (onMessage) {
        onMessage({
          type: 'session-warning',
          data
        });
      }
    });

    socket.on('session-expired', (data) => {
      console.log('🔴 Session expired:', data);
      if (onMessage) {
        onMessage({
          type: 'session-expired',
          data
        });
      }
    });

    socket.on('consultation-ended', (data) => {
      console.log('Consultation ended by server');
      if (onMessage) {
        onMessage({
          type: 'consultation-ended',
          data
        });
      }
    });

    // Session Management Events
    socket.on('session-time-left', (data) => {
      if (onMessage) {
        onMessage({
          type: 'session-time-left',
          data
        });
      }
    });

    socket.on('session-alert', (data) => {
      if (onMessage) {
        onMessage({
          type: 'session-alert',
          data
        });
      }
    });

    socket.on('session-extended', (data) => {
      console.log('✅ Session extended:', data);
      if (onMessage) {
        onMessage({
          type: 'session-extended',
          data
        });
      }
    });

    // Advanced Messaging Events
    socket.on('message-edited', (data) => {
      if (onMessage) {
        onMessage({
          type: 'message-edited',
          data
        });
      }
    });

    socket.on('message-deleted', (data) => {
      if (onMessage) {
        onMessage({
          type: 'message-deleted',
          data
        });
      }
    });

    socket.on('message-edit-failed', (data) => {
      if (onMessage) {
        onMessage({
          type: 'message-edit-failed',
          data
        });
      }
    });

    socket.on('message-delete-failed', (data) => {
      if (onMessage) {
        onMessage({
          type: 'message-delete-failed',
          data
        });
      }
    });

    // Wallet & Payment Events
    socket.on('wallet-balance-update', (data) => {
      if (onMessage) {
        onMessage({
          type: 'wallet-balance-update',
          data
        });
      }
    });

    socket.on('wallet-deducted', (data) => {
      if (onMessage) {
        onMessage({
          type: 'wallet-deducted',
          data
        });
      }
    });

    socket.on('wallet-insufficient', (data) => {
      if (onMessage) {
        onMessage({
          type: 'wallet-insufficient',
          data
        });
      }
    });

    socket.on('payment-processed', (data) => {
      if (onMessage) {
        onMessage({
          type: 'payment-processed',
          data
        });
      }
    });

    // Admin Control Events
    socket.on('admin-override-active', (data) => {
      if (onMessage) {
        onMessage({
          type: 'admin-override-active',
          data
        });
      }
    });

    socket.on('consultation-rerouted', (data) => {
      if (onMessage) {
        onMessage({
          type: 'consultation-rerouted',
          data
        });
      }
    });

    // UI/UX Enhancement Events
    socket.on('notification-popup', (data) => {
      if (onMessage) {
        onMessage({
          type: 'notification-popup',
          data
        });
      }
    });

    return () => {
      if (socket) {
        socket.emit('leave-consultation', consultationId);
        socket.disconnect();
      }
    };
  }, [consultationId, onMessage]);

  // Helper functions for new Socket.IO events
  const emitEditMessage = (messageId: number, newContent: string, userId: number) => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('message-edit', {
        consultationId,
        messageId,
        newContent,
        userId
      });
    }
  };

  const emitDeleteMessage = (messageId: number, userId: number, deleteForAll: boolean = false) => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('message-delete', {
        consultationId,
        messageId,
        userId,
        deleteForAll
      });
    }
  };

  const emitWalletBalanceCheck = (userId: number) => {
    if (socketRef.current) {
      socketRef.current.emit('wallet-balance-check', { userId });
    }
  };

  const emitWalletDeduct = (userId: number, amount: number, reason: string) => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('wallet-deduct', {
        userId,
        amount,
        reason,
        consultationId
      });
    }
  };

  const emitSessionTimeLeftRequest = () => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('session-time-left', { consultationId });
    }
  };

  const emitNotificationPopup = (userId: number, title: string, message: string, type: string = 'info') => {
    if (socketRef.current && consultationId) {
      socketRef.current.emit('notification-popup', {
        consultationId,
        userId,
        title,
        message,
        type
      });
    }
  };

  return {
    socket: socketRef.current,
    emitEditMessage,
    emitDeleteMessage,
    emitWalletBalanceCheck,
    emitWalletDeduct,
    emitSessionTimeLeftRequest,
    emitNotificationPopup
  };
}