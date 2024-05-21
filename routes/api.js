var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('./db/BTC.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Failed to open database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// 新增獲取日期列表的端點
router.get('/dates', (req, res) => {
    var sql = 'SELECT DISTINCT Date FROM price ORDER BY Date';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows.map(row => row.Date)
        });
    });
});

// 修改獲取指定日期數據的端點
router.get('/date', (req, res) => {
    var date = req.query.date;
    if (!date) {
        res.status(400).json({ error: 'Date parameter is required' });
        return;
    }

    var sql = 'SELECT OpenPrice, HighPrice, LowPrice, ClosePrice, Volume FROM price WHERE Date = ?';
    db.all(sql, [date], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (rows.length === 0) {
            res.status(404).json({ error: 'No data found for the selected date' });
            return;
        }
        var data = rows[0]; // 假設每個日期只有一條記錄
        res.json({
            message: 'success',
            data: {
                OpenPrice: data.OpenPrice,
                HighPrice: data.HighPrice,
                LowPrice: data.LowPrice,
                ClosePrice: data.ClosePrice,
                Volume: data.Volume
            }
        });
    });
});

module.exports = router;
