const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 2000;  // используем переменную окружения для порта

// Настройка для обработки JSON
app.use(express.json());

// Эндпоинт для получения данных от датчика
app.post('/sensor', (req, res) => {
   const sensorData = req.body;
   console.log('Данные от датчика:', sensorData);

   // Генерация сообщения для Алисы
   const message = `Концентрация частиц PM1.0 (SDS_P1): ${sensorData.sensordatavalues.find(v => v.value_type === 'SDS_P1').value}, Концентрация частиц PM2.5 (SDS_P2): ${sensorData.sensordatavalues.find(v => v.value_type === 'SDS_P2').value}`;

   res.json({ message });
});

// Запуск сервера
app.listen(port, () => {
   console.log(`Сервер слушает порт ${port}`);
});
