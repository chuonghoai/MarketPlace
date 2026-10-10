import * as dotenv from 'dotenv';
import * as path from 'path';
import mysql, { RowDataPacket } from 'mysql2/promise';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

interface IdRow extends RowDataPacket {
  id: string;
}

interface UserIdRow extends RowDataPacket {
  userId: string;
}

// Load .env.dev
const envPath = path.resolve(process.cwd(), '.env.dev');
dotenv.config({ path: envPath });

async function seed() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const appEnv = process.env.APP_ENV || 'dev';

  if (appEnv === 'prod' || nodeEnv === 'production') {
    console.error(
      '⛔ CẢNH BÁO: Script seed dữ liệu mẫu CHỈ được phép chạy trên môi trường DEV!',
    );
    process.exit(1);
  }

  console.log('🌱 Bắt đầu seed dữ liệu mẫu Support Request & Staff KPI...');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'marketplace',
  });

  try {
    const passwordHash = await bcrypt.hash('Staff@123', 10);

    // 1. Tạo 2 Staff Users
    const staffList = [
      {
        email: 'staff1@marketnest.vn',
        name: 'Nguyễn Văn Hùng',
        salary: 15000000,
      },
      { email: 'staff2@marketnest.vn', name: 'Trần Thị Mai', salary: 14000000 },
    ];

    const staffIds: string[] = [];

    for (const s of staffList) {
      const [existingUsers] = await connection.execute<IdRow[]>(
        'SELECT id FROM users WHERE email = ?',
        [s.email],
      );

      let userId = existingUsers[0]?.id;
      if (!userId) {
        userId = randomUUID();
        await connection.execute(
          `INSERT INTO users (id, email, password, fullName, role, createdAt) VALUES (?, ?, ?, ?, 'STAFF', NOW())`,
          [userId, s.email, passwordHash, s.name],
        );
      }

      const [existingStaff] = await connection.execute<IdRow[]>(
        'SELECT id FROM staffs WHERE userId = ?',
        [userId],
      );

      let staffId = existingStaff[0]?.id;
      if (!staffId) {
        staffId = randomUUID();
        await connection.execute(
          `INSERT INTO staffs (id, userId, salary, createdAt) VALUES (?, ?, ?, NOW())`,
          [staffId, userId, s.salary],
        );
      }
      staffIds.push(staffId);
    }

    // 2. Tạo 1 User requester
    const customerEmail = 'customer.kpi@marketnest.vn';
    const [existingCustomer] = await connection.execute<IdRow[]>(
      'SELECT id FROM users WHERE email = ?',
      [customerEmail],
    );

    let customerId = existingCustomer[0]?.id;
    if (!customerId) {
      customerId = randomUUID();
      await connection.execute(
        `INSERT INTO users (id, email, password, fullName, role, createdAt) VALUES (?, ?, ?, 'Khách Hàng Mẫu', 'USER', NOW())`,
        [customerId, customerEmail, passwordHash],
      );
    }

    console.log(`✅ Đã sẵn sàng nhân viên (${staffIds.length}) và khách hàng.`);

    // 3. Tạo danh sách các yêu cầu hỗ trợ mẫu trong 30 ngày qua
    const sampleTopics = [
      {
        title: 'Lỗi thanh toán đơn hàng qua Ví điện tử',
        content: 'Tôi đã thanh toán nhưng đơn vẫn báo chờ xử lý.',
      },
      {
        title: 'Hỏi về thời gian giao hàng liên tỉnh',
        content: 'Đơn hàng #ORD-102 khi nào sẽ được vận chuyển tới Đà Nẵng?',
      },
      {
        title: 'Yêu cầu hoàn trả sản phẩm lỗi',
        content:
          'Gốm sứ bị nứt vỡ trong quá trình vận chuyển, tôi muốn đổi trả.',
      },
      {
        title: 'Không áp dụng được mã giảm giá voucher',
        content: 'Mã GIAM20 bao lỗi không đủ điều kiện dù đơn đã 500k.',
      },
      {
        title: 'Cần hỗ trợ thay đổi địa chỉ nhận hàng',
        content: 'Tôi muốn đổi địa chỉ nhận sang quận Bình Thạnh.',
      },
      {
        title: 'Tài khoản không nhận được OTP xác thực',
        content:
          'Tôi ấn gửi lại OTP nhiều lần nhưng không thấy tin nhắn về số điện thoại.',
      },
      {
        title: 'Hỏi về quy chế đấu giá sản phẩm nghệ nhân',
        content:
          'Số tiền đặt cọc đấu giá sẽ được hoàn lại khi nào nếu không trúng?',
      },
      {
        title: 'Sản phẩm giao thiếu phụ kiện',
        content:
          'Hộp sản phẩm không có tờ hướng dẫn sử dụng và chứng nhận nghệ nhân.',
      },
    ];

    const now = new Date();

    for (let i = 0; i < 20; i++) {
      const topic = sampleTopics[i % sampleTopics.length];
      const assignedStaffId = staffIds[i % staffIds.length];
      const daysAgo = Math.floor(i * 1.4); // rải rác trong 28 ngày qua

      const createdAt = new Date(
        now.getTime() - daysAgo * 24 * 60 * 60 * 1000 - Math.random() * 3600000,
      );
      const assignedAt = new Date(createdAt.getTime() + 10 * 60 * 1000); // 10 phút sau thì được gán

      // Tạo firstResponseAt: một số dưới 120 phút (đạt SLA), một số trên 120 phút (vượt SLA)
      const meetsSla = i % 3 !== 0; // 66% đạt SLA
      const responseDelayMinutes = meetsSla
        ? Math.floor(15 + Math.random() * 60)
        : Math.floor(130 + Math.random() * 120);
      const firstResponseAt = new Date(
        assignedAt.getTime() + responseDelayMinutes * 60 * 1000,
      );

      // Status
      let status = 'RESOLVED';
      let resolvedAt: Date | null = new Date(
        firstResponseAt.getTime() + (60 + Math.random() * 240) * 60 * 1000,
      );
      let closedAt: Date | null = null;

      if (i === 18) {
        status = 'IN_PROGRESS';
        resolvedAt = null;
      } else if (i === 19) {
        status = 'ASSIGNED';
        resolvedAt = null;
      } else if (i % 5 === 0) {
        status = 'CLOSED';
        closedAt = new Date(resolvedAt.getTime() + 3600000);
      }

      const reqId = randomUUID();

      await connection.execute(
        `INSERT INTO support_requests (id, title, content, status, requesterId, assignedStaffId, createdAt, assignedAt, firstResponseAt, resolvedAt, closedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          reqId,
          `${topic.title} (${i + 1})`,
          topic.content,
          status,
          customerId,
          assignedStaffId,
          createdAt,
          assignedAt,
          firstResponseAt,
          resolvedAt,
          closedAt,
        ],
      );

      // Thêm message
      await connection.execute(
        `INSERT INTO support_request_messages (id, requestId, senderId, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
        [randomUUID(), reqId, customerId, topic.content, createdAt],
      );

      if (firstResponseAt && assignedStaffId) {
        const [staffRows] = await connection.execute<UserIdRow[]>(
          'SELECT userId FROM staffs WHERE id = ?',
          [assignedStaffId],
        );
        const staffUserId = staffRows[0]?.userId;
        if (staffUserId) {
          await connection.execute(
            `INSERT INTO support_request_messages (id, requestId, senderId, content, createdAt) VALUES (?, ?, ?, ?, ?)`,
            [
              randomUUID(),
              reqId,
              staffUserId,
              'Chào bạn, MarketNest đã tiếp nhận yêu cầu và đang xử lý giúp bạn ngay ạ.',
              firstResponseAt,
            ],
          );
        }
      }
    }

    console.log(
      '🎉 Seed thành công 20 yêu cầu hỗ trợ với dữ liệu KPI phân bố đa dạng!',
    );
  } catch (err) {
    console.error('❌ Lỗi khi seed dữ liệu:', err);
  } finally {
    await connection.end();
  }
}

void seed();
