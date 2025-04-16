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

// Эндпоинт для обработки запросов от Алисы
app.post('/skill', async (req, res) => {
   const command = req.body.request.command.toLowerCase();

   // Если команда включает запрос о концентрации частиц
   if (command.includes('концентрация частиц')) {
      try {
         // Отправляем запрос на сервер для получения данных с датчика
         const sensorData = await axios.post('https://yandex-air-skill.onrender.com/sensor', {
            sensordatavalues: [
               { value_type: 'SDS_P1', value: '2.40' },
               { value_type: 'SDS_P2', value: '1.15' }
            ]
         });

         // Извлекаем данные из ответа
         const message = sensorData.data.message;

         // Отправляем ответ Алисе
         res.json({
            version: '1.0',
            response: {
               text: message,
               end_session: false
            }
         });
      } catch (error) {
         console.error('Ошибка при запросе данных с сервера:', error);
         res.json({
            version: '1.0',
            response: {
               text: 'Произошла ошибка при получении данных о концентрации частиц.',
               end_session: true
            }
         });
      }
   } else {
      res.json({
         version: '1.0',
         response: {
            text: 'Извините, я не могу понять вашу команду.',
            end_session: true
         }
      });
   }
});

// Запуск сервера
app.listen(port, () => {
   console.log(`Сервер слушает порт ${port}`);
});
