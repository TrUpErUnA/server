const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// Переменная для хранения последних данных с датчика
let latestSensorData = null;

// Эндпоинт для датчика
app.post('/sensor-data', (req, res) => {
   console.log("===== ПОЛУЧЕН ЗАПРОС ОТ ДАТЧИКА =====");
   console.log("Заголовки:", req.headers);
   console.log("Тело запроса:", req.body);
   res.sendStatus(200);
});


// Эндпоинт для навыка Алисы
app.post('/', (req, res) => {
   console.log('Запрос от Алисы:', req.body);
   const { request, session, version } = req.body;

   let responseText = 'Я не совсем поняла ваш запрос. Попробуйте снова.';

   if (request.command.includes('качество') || request.command.includes('воздух')) {
      if (latestSensorData && latestSensorData.sensordatavalues) {
         const sdsP1 = latestSensorData.sensordatavalues.find(v => v.value_type === 'SDS_P1');
         const sdsP2 = latestSensorData.sensordatavalues.find(v => v.value_type === 'SDS_P2');

         if (sdsP1 && sdsP2) {
            responseText = `Концентрация частиц PM10: ${sdsP1.value}, PM2.5: ${sdsP2.value}.`;
         } else {
            responseText = 'Данные о концентрации частиц пока недоступны.';
         }
      } else {
         responseText = 'Пока нет данных с датчика. Попробуйте чуть позже.';
      }
   }

   res.json({
      version,
      session,
      response: {
         text: responseText,
         end_session: false
      }
   });
});

app.listen(port, () => {
   console.log(`Сервер запущен на порту ${port}`);
});
