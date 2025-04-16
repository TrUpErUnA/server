const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

let lastSensorData = null;

// Эндпоинт для обновления данных от датчика
app.post('/sensor-data', (req, res) => {
   const { sensordatavalues } = req.body;
   if (!sensordatavalues) {
      return res.status(400).json({ error: 'Нет данных от датчика' });
   }

   lastSensorData = sensordatavalues;
   console.log('Сохранены новые данные от датчика:', sensordatavalues);
   res.json({ status: 'ok' });
});

// Главный эндпоинт Алисы
app.post('/', (req, res) => {
   console.log('Запрос от Алисы:', req.body);

   const command = req.body.request.command.toLowerCase();

   let text = 'Я не совсем поняла ваш запрос. Попробуйте снова.';

   if (command.includes('качество воздуха') || command.includes('концентрация частиц')) {
      if (lastSensorData) {
         const sdsP1 = lastSensorData.find(v => v.value_type === 'SDS_P1');
         const sdsP2 = lastSensorData.find(v => v.value_type === 'SDS_P2');

         if (sdsP1 && sdsP2) {
            text = `Концентрация частиц PM10: ${sdsP1.value}, PM2.5: ${sdsP2.value}`;
         } else {
            text = 'Данные от датчика получены, но не полные.';
         }
      } else {
         text = 'Пока нет актуальных данных от датчика.';
      }
   }

   res.json({
      version: req.body.version,
      session: req.body.session,
      response: {
         text,
         end_session: false
      }
   });
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});
