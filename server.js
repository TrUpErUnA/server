const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // если датчик шлёт URL-кодированные данные

// Переменная для хранения последних данных с датчика
let latestSensorData = null;

// Эндпоинт для датчика
app.post('/sensor-data', (req, res) => {
   console.log("===== ПОЛУЧЕН ЗАПРОС ОТ ДАТЧИКА =====");
   console.log("Заголовки запроса:", req.headers);
   console.log("Тип содержимого:", req.headers['content-type']);
   console.log("Тело запроса:", req.body);

   // Сохраняем данные от датчика
   latestSensorData = req.body;

   res.sendStatus(200);
});

// Эндпоинт для навыка Алисы
app.post('/', (req, res) => {
   console.log("===== ЗАПРОС ОТ АЛИСЫ =====");
   console.log("Тело запроса:", JSON.stringify(req.body, null, 2));

   const { request, session, version } = req.body;

   let responseText = 'Я не совсем поняла ваш запрос. Попробуйте снова.';

   if (request.command.includes('качество') || request.command.includes('воздух')) {
      if (latestSensorData && latestSensorData.sensor === 'data') {
         // Пример ответа с данными, полученными от датчика
         responseText = `Данные от датчика: ${JSON.stringify(latestSensorData)}`;
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
