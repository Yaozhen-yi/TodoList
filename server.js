// server.js
import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// 數據庫連接
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '910221',
    database: 'users'
});

// 處理用戶註冊請求
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
         // 獲取當下時間
        const currentTime = new Date();
       // 插入註冊的用戶數據,包括註冊時間
    const sql = 'INSERT INTO users (name, email, password,logintime) VALUES (?, ?, ?, ?)';
        db.query(sql, [name, email, hashedPassword,currentTime], (err, result) => {
            if (err) {
                console.error('Error inserting data:', err);
                return res.status(500).json({ success: false, message: '服務器錯誤' });
            }
            res.json({ success: true });
            //返回生成的用户 ID
        res.json({ success: true, userId: result.insertId });
        });
    } catch (error) {
        console.error('Error hashing password:', error);
        res.status(500).json({ success: false, message: '服務器錯誤' });
    }
});

// 處理用戶登錄請求
app.post('/api/login', (req, res) => {
    const { name, email, password } = req.body;

    const query = 'SELECT * FROM users WHERE name = ? AND email = ?';
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
                    const updateQuery = 'UPDATE users SET logintime = ? WHERE id = ?';
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

    const sql = 'INSERT INTO tasks (text, user_id) VALUES (?, ?)';
    
    db.query(sql, [text, user_id], (err, result) => {
        if (err) {
            console.error('添加任務錯誤:', err);
            return res.status(500).send({ success: false, message: '添加任務出現錯誤' });
        }

        // 查询刚插入的数据以获得 createid
        const selectSql = 'SELECT createid FROM tasks WHERE user_id = ? AND text = ? ORDER BY createid DESC LIMIT 1';
        db.query(selectSql, [user_id, text], (selectErr, selectResult) => {
            if (selectErr) {
                console.error('查询 createid 错误:', selectErr);
                return res.status(500).send({ success: false, message: '查询 createid 错误' });
            }

            const createid = selectResult[0] ? selectResult[0].createid : null;
            console.log('返回的 createid:', createid); // 打印返回的 createid
            res.json({ success: true, message: '任務已添加', createid });
        });
    });
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
