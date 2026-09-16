# Realtime & WebSocket Rules (Socket.IO Client)

Tài liệu này quy định cách kết nối, xử lý sự kiện và dọn dẹp kết nối WebSocket sử dụng `socket.io-client` trong ứng dụng Web Frontend.

---

## 1. Khởi tạo & Quản lý kết nối (Connection Lifecycle)

- **Thư viện:** `socket.io-client`.
- **Cấu hình kết nối:**
  - Kết nối tới WebSocket Gateway của Backend (cùng origin hoặc biến môi trường `VITE_WS_URL`).
  - Hỗ trợ truyền Token xác thực qua `auth: { token: ... }` hoặc gửi cookie session.
  - Cấu hình tự động kết nối lại (`reconnection: true`, `reconnectionAttempts: 5`, `reconnectionDelay: 1000`).

---

## 2. Quy tắc sử dụng trong React Components / Hooks

### 2.1 Bắt buộc dọn dẹp Listener trong `useEffect` Cleanup
Để tránh rò rỉ bộ nhớ (Memory Leak) và trùng lặp sự kiện (Duplicate Event Triggers):

```tsx
import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

export const useOrderRealtime = (orderId: string, onStatusChange: (status: string) => void) => {
  useEffect(() => {
    const socket: Socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.emit('joinOrderRoom', { orderId });

    socket.on('orderStatusUpdated', (data) => {
      if (data.orderId === orderId) {
        onStatusChange(data.newStatus);
      }
    });

    // BẮT BUỘC cleanup khi component unmount
    return () => {
      socket.off('orderStatusUpdated');
      socket.emit('leaveOrderRoom', { orderId });
      socket.disconnect();
    };
  }, [orderId, onStatusChange]);
};
```

---

## 3. Quy chuẩn đặt tên sự kiện (Event Naming)

- **Client phát lên Server:** Dạng camelCase hành động (ví dụ: `joinRoom`, `sendMessage`, `typing`).
- **Server gửi về Client:** Dạng camelCase sự kiện hoàn thành (ví dụ: `orderStatusUpdated`, `newNotification`, `messageReceived`).
- **Payload Format:** Luôn là JSON Object có cấu trúc rõ ràng kèm timestamp và ID liên quan.
