import { io, Socket } from 'socket.io-client';
import { ENV } from '../../../core/config/env.config';
import { tokenService } from '../../../core/auth/token.service';
import { userStorageService } from '../../user/services/userStorage.service';
import type { SupportRequest, SupportRequestMessage } from '../models/support.model';

class SupportSocketService {
  private socket: Socket | null = null;
  private currentRoom: string | null = null;

  connect(): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    if (this.socket && !this.socket.connected) {
      this.socket.connect();
      return this.socket;
    }

    const token = tokenService.getAccessToken();
    const currentUser = userStorageService.getUser();

    const socketUrl = `${ENV.API_URL}/support`;

    this.socket = io(socketUrl, {
      withCredentials: true,
      autoConnect: true,
      transports: ['websocket', 'polling'],
      auth: {
        token: token || undefined,
        userId: currentUser?.id || undefined,
      },
      extraHeaders: token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    });

    this.socket.on('connect', () => {
      console.log('[SupportSocket] Connected to server:', this.socket?.id);
      if (this.currentRoom) {
        this.socket?.emit('joinRoom', { requestId: this.currentRoom });
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('[SupportSocket] Disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.warn('[SupportSocket] Connection error:', error.message);
    });

    return this.socket;
  }

  joinRoom(requestId: string) {
    this.currentRoom = requestId;
    const socket = this.connect();
    socket.emit('joinRoom', { requestId });
  }

  leaveRoom(requestId: string) {
    if (this.currentRoom === requestId) {
      this.currentRoom = null;
    }
    if (this.socket && this.socket.connected) {
      this.socket.emit('leaveRoom', { requestId });
    }
  }

  sendMessage(requestId: string, content: string): Promise<SupportRequestMessage> {
    return new Promise((resolve, reject) => {
      const socket = this.connect();
      const token = tokenService.getAccessToken();
      const currentUser = userStorageService.getUser();

      const timer = setTimeout(() => {
        reject(new Error('WebSocket timeout: Không nhận được phản hồi từ máy chủ'));
      }, 8000);

      socket.emit(
        'sendMessage',
        {
          requestId,
          content,
          token: token || undefined,
          userId: currentUser?.id || undefined,
        },
        (response: { status: string; data?: SupportRequestMessage; message?: string }) => {
          clearTimeout(timer);
          if (response && response.status === 'success' && response.data) {
            resolve(response.data);
          } else {
            reject(new Error(response?.message || 'Không thể gửi tin nhắn qua WebSocket'));
          }
        },
      );
    });
  }

  onNewMessage(callback: (message: SupportRequestMessage) => void): () => void {
    const socket = this.connect();
    const handler = (message: SupportRequestMessage) => {
      callback(message);
    };

    socket.on('newMessage', handler);

    return () => {
      socket.off('newMessage', handler);
    };
  }

  onRequestUpdated(callback: (request: Partial<SupportRequest>) => void): () => void {
    const socket = this.connect();
    const handler = (request: Partial<SupportRequest>) => {
      callback(request);
    };

    socket.on('requestUpdated', handler);

    return () => {
      socket.off('requestUpdated', handler);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.currentRoom = null;
    }
  }

  isConnected(): boolean {
    return !!this.socket && this.socket.connected;
  }
}

export const supportSocketService = new SupportSocketService();
