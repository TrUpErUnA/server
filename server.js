const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 10000;  // используем переменную окружения для порта

// Настройка для обработки JSON
app.use(express.json());

// Эндпоинт для получения данных от датчика
app.post('/sensor', (req, res) => {
   const sensorData = req.body;
   console.log('Данные от датчика:', sensorData);

   // Проверка наличия данных перед использованием find
   const sdsP1 = sensorData.sensordatavalues ? sensorData.sensordatavalues.find(v => v.value_type === 'SDS_P1') : null;
   const sdsP2 = sensorData.sensordatavalues ? sensorData.sensordatavalues.find(v => v.value_type === 'SDS_P2') : null;

   if (sdsP1 && sdsP2) {
      const message = `Концентрация частиц PM1.0 (SDS_P1): ${sdsP1.value}, Концентрация частиц PM2.5 (SDS_P2): ${sdsP2.value}`;
      res.json({ message });
   } else {
      res.status(400).json({ error: 'Не удалось получить данные о концентрации частиц' });
   }
});

// Запуск сервера
app.listen(port, () => {
   console.log(`Сервер слушает порт ${port}`);
});
