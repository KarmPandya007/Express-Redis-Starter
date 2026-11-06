# 🚀 Express Redis Starter

An **Express.js** backend demonstrating **Redis caching** alongside MongoDB.

---

## ✨ Features

- Redis cache for the user-list API
- Cache expiry and invalidation after user changes
- Clean & modular Express architecture

---

## 🛠 Tech Stack

- Node.js
- Express.js
- Redis
- MongoDB
- dotenv, ioredis, express-rate-limit

---

## 📂 Project Structure

```bash
express-redis-starter/
├── src/
│   ├── config/
│   │   ├── redis.js
│   │   └── db.js
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   │   ├── cache.middleware.js
│   │   └── rateLimiter.middleware.js
│   └── app.js
├── .env.example
├── package.json
├── server.js
└── README.md
```

## 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/express-redis-starter.git
cd express-redis-starter
```

## 2️⃣ Install dependencies
```bash
npm install
```

## 3️⃣ Configure the app
Create a `.env` file in the project root:
```bash
PORT=8000
MONGO_URI=mongodb://127.0.0.1:27017/express-redis-starter
JWT_SECRET=replace-this-with-a-long-random-secret
REDIS_URL=redis://127.0.0.1:6379
```

`REDIS_URL` defaults to `redis://127.0.0.1:6379` if omitted.

## 4️⃣ Start Redis
With Docker Compose:
```bash
docker compose up -d redis
```
Or run it directly:
```bash
docker run --name express-redis -d -p 6379:6379 redis
```

Or use a locally installed Redis server:
```bash
redis-server
```

## 5️⃣ Start the API
Make sure MongoDB is running, then start the app:
```bash
npm run dev
```
Application will be available at:
```bash
http://localhost:8000
```

## Using Redis caching

The protected `GET /api/users` endpoint caches the password-free user list in
Redis under `users:all` for 60 seconds. User registration, creation, updates,
and deletion clear that cache so the next request reads fresh data from MongoDB.
Log in through `POST /api/auth/login` and send the returned JWT as a Bearer
token in the `Authorization` header when calling `GET /api/users`. Redis caching
happens automatically; you can inspect the key and its remaining lifetime with:
```bash
redis-cli GET users:all
redis-cli TTL users:all
```
