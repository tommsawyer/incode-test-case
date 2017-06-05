# Incode systems back-end test case  
 
 **Установка**
 1) выполнить *npm install*
 2) скопировать примеры конфигов из *./config/sample_configs* в *./configs*
 3) заполнить конфиги в *./config*
 4) создать базы данных в Postresql
 5) запустить миграции - *npm run migrate*
 6) запустить сервер - *npm start* (запуск тестов с помощью *npm test*)
  
**API**  
**User**
*POST /user* : регистрация нового пользователя. принимает email, name, password, profile_photo (multipart/form-data)  
*PUT /user* : изменение профиля. необходима авторизация  
*DELETE /user* : удаление профиля. необходима авторизация  
*GET /user:id*: получение профиля по айди  
*GET /user*: получение всех пользователей  

**Auth**
*POST /auth* : получение токена для авторизации. принимает email, password. Токен необходимо устанавливать в хедер Authorization  
 
 **UserTrack**
*POST /track* : добавление нового трека. принимает track_url. необходима авторизация  
*PUT /track* : изменение трека. необходима авторизация  
*DELETE /track* : удаление трека. необходима авторизация  
*GET /track:id*: получение трека по айди  
*GET /track*: получение всех треков  

