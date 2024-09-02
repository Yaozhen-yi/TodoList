// server.js
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config({ path: '.env.production' });

const app = express();
const port = process.env.PORT || 3000;

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"], // 允许内联脚本和来自 gstatic 的脚本
            styleSrc: ["'self'", "'unsafe-inline'", "https://www.gstatic.com"], // 允许内联样式和来自 gstatic 的样式表
            imgSrc: ["'self'", "data:", "https://www.gstatic.com"], // 允许来自 gstatic 的图片
            connectSrc: ["'self'"],
            fontSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameSrc: ["'none'"],
        },
    })
);


// 允许来自特定来源的请求
const allowedOrigins = [
    'http://localhost:5173',       // 开发环境
    'https://todolist-s1pw.onrender.com' // 生产环境
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
    credentials: true
  }));

  app.use(express.json());
  app.use(express.static('dist'));
app.use(bodyParser.json());

// 數據庫連接
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });


db.connect((err) => {
    if (err) {
      console.error('Database connection error:', err);
      return;
    }
    console.log('Connected to the database');
  });

// 處理用戶註冊請求
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // 获取当前时间
        const currentTime = new Date();

        // 插入注册的用户数据，包括注册时间
        const sql = 'INSERT INTO user (name, password, email, logintime) VALUES (?, ?, ?, ?)';

        // 使用 Promise 封装 db.query，以便使用 await
        const query = (sql, params) => {
            return new Promise((resolve, reject) => {
                db.query(sql, params, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        };
        try {
            const result = await query(sql, [name, hashedPassword, email, currentTime]);
            res.json({ success: true, userId: result.insertId });
        } catch (error) {
            console.error('Error inserting data:', error);
            res.status(500).json({ success: false, message: '服務器錯誤' });
        }
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});

// 處理用戶登錄請求
app.post('/api/login', (req, res) => {
    const { name, email, password } = req.body;

    const query = 'SELECT * FROM user WHERE name = ? AND email = ?';
    db.query(query, [name, email], async (err, results) => {
        if (err) {
            console.error('Error querying database:', err);
            return res.status(500).send({ success: false, message: '服務器錯誤' });
        }
        if (results.length > 0) {
            const user = results[0];
            try {
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    // 更新用戶時間
                    const updateQuery = 'UPDATE user SET logintime = ? WHERE id = ?';
                    const currentTime = new Date(); // 當前時間
                    db.query(updateQuery, [currentTime, user.id], (updateErr) => {
                        if (updateErr) {
                            console.error('Error updating logintime:', updateErr);
                            return res.status(500).send({ success: false, message: '服務器錯誤' });
                        }
                        
                        // 成功登录并更新登录时间
                        res.send({
                            success: true,
                            message: '登录成功',
                            token: 'dummy-jwt-token',
                            userName: user.name,
                            userId: user.id // 确保这里返回了 userId
                        });
                    });
                } else {
                    res.status(401).send({ success: false, message: '密碼錯誤' });
                }
            } catch (bcryptError) {
                console.error('Error comparing password:', bcryptError);
                res.status(500).send({ success: false, message: '服務器錯誤' });
            }
        } else {
            res.status(401).send({ success: false, message: '用戶不存在' });
        }
    });
});

//處理代辦事項

app.post('/api/create', (req, res) => {
    const { text, user_id } = req.body;
    console.log('代辦事項:', req.body);

    if (!user_id) {
        return res.status(400).json({ success: false, message: '用户ID缺失' });
    }

    // 查询当前用户的最大 createid
    const maxCreateIdSql = 'SELECT COALESCE(MAX(createid), 0) AS max_createid FROM tasks WHERE user_id = ?';
    
    db.query(maxCreateIdSql, [user_id], (maxCreateIdErr, maxCreateIdResult) => {
        if (maxCreateIdErr) {
            console.error('查询最大 createid 错误:', maxCreateIdErr);
            return res.status(500).send({ success: false, message: '查询最大 createid 错误' });
        }

        const maxCreateid = maxCreateIdResult[0].max_createid;
        const newCreateid = maxCreateid + 1;
        console.log('新的 createid:', newCreateid); // 打印新的 createid

        // 插入新任务
        const insertSql = 'INSERT INTO tasks (createid, text, user_id) VALUES (?, ?, ?)';
        db.query(insertSql, [newCreateid, text, user_id], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('添加任務錯誤:', insertErr);
                return res.status(500).send({ success: false, message: '添加任務出現錯誤' });
            }

            res.json({ success: true, message: '任務已添加', createid: newCreateid });
        });
    });
});


// 獲取用戶所有任務
app.post('/api/tasks', (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: '用户ID缺失' });
    }

    const sql = 'SELECT createid, text, status FROM tasks WHERE user_id = ?';
    
    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('獲取任務列表錯誤:', err);
            return res.status(500).send({ success: false, message: '獲取任務列表出錯' });
        }

        res.json({ success: true, tasks: results });
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
