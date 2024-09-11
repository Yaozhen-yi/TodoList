// server.js
import express from 'express';
import pg from 'pg';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// 在本地开发时加载 .env.development 文件
if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: '.env.development' });
} else {
  // 在生产环境时加载 .env.production 文件
  dotenv.config({ path: '.env.production' });
}

const app = express();
const port = process.env.PORT || 3000;

// 允许特定来源的请求
const allowedOrigins = [
    'http://localhost:5173',       // 开发环境
    'https://yao-todolist.zeabur.app' // 生产环境
];

app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'] // 允许的头部字段
  }));

  app.use(express.json());
app.use(bodyParser.json());


// 配置 PostgreSQL 连接
const pool = new pg.Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // 根据需要启用或禁用 SSL
    }
  });


// 测试连接
pool.connect((err, client, release) => {
    if (err) {
      console.error('Database connection error:', err.stack);
      return;
    }
    console.log('Connected to the database');
    release();
  });

// 處理用戶註冊請求
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    console.log('Received registration request:', req.body);
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 取得當前時間
        const currentTime = new Date();

        // 插入註冊的用戶數據，包括註冊時間
        const sql = 'INSERT INTO "user" (name, password, email, logintime) VALUES ($1, $2, $3, $4) RETURNING id';
        const values = [name, hashedPassword, email, currentTime];

        try {
            const result = await pool.query(sql, values);
            res.json({ success: true, userId: result.rows[0].id });
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ success: false, message: '服務器錯誤' });
        }
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});

// 处理用户登录请求
app.post('/api/login', async (req, res) => {
    const { name, email, password } = req.body;
  
    const query = 'SELECT * FROM "user" WHERE name = $1 AND email = $2';
    try {
      const result = await pool.query(query, [name, email]);
      if (result.rows.length > 0) {
        const user = result.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          // 更新用户时间
          const updateQuery = 'UPDATE "user" SET logintime = $1 WHERE id = $2';
          const currentTime = new Date(); // 当前时间
          await pool.query(updateQuery, [currentTime, user.id]);
  
          // 成功登录并更新用户时间
          res.send({
            success: true,
            message: '登录成功',
            token: 'dummy-jwt-token',
            userName: user.name,
            userId: user.id
          });
        } else {
          res.status(401).send({ success: false, message: '密码错误' });
        }
      } else {
        res.status(401).send({ success: false, message: '用户不存在' });
      }
    } catch (error) {
      console.error('Error querying database:', error);
      res.status(500).send({ success: false, message: '服务端错误' });
    }
  });
  
  // 处理代办事项
  app.post('/api/create', async (req, res) => {
    const { text, user_id } = req.body;
    console.log('代办事项:', req.body);
  
    if (!user_id) {
      return res.status(400).json({ success: false, message: '用户ID缺失' });
    }
  
    const sql = 'INSERT INTO tasks (text, user_id) VALUES ($1, $2) RETURNING createid';
    try {
      const result = await pool.query(sql, [text, user_id]);
      const createid = result.rows[0].createid;
      console.log('返回的 createid:', createid); // 打印返回的 createid
      res.json({ success: true, message: '任务已添加', createid });
    } catch (error) {
      console.error('添加任务错误:', error);
      res.status(500).send({ success: false, message: '添加任务出现错误' });
    }
  });
  
  // 获取用户所有任务
  app.post('/api/tasks', async (req, res) => {
    const { user_id } = req.body;
  
    if (!user_id) {
      return res.status(400).json({ success: false, message: '用户ID缺失' });
    }
  
    const sql = 'SELECT createid, text, status FROM tasks WHERE user_id = $1';
    try {
      const result = await pool.query(sql, [user_id]);
      res.json({ success: true, tasks: result.rows });
    } catch (error) {
      console.error('获取任务列表错误:', error);
      res.status(500).send({ success: false, message: '获取任务列表出错' });
    }
  });
  
  // 处理静态文件
app.use(express.static('dist'));

// 处理所有其他未匹配的路由（返回前端的 index.html）
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });