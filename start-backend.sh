echo "========== creating docker container ============"
docker build -t redis-back:latest .
echo "========== stopping existing container if running ============"
docker rm -f redis-backend 2>/dev/null || true
CONTAINER_ON_PORT=$(docker ps -q --filter "publish=8000")
if [ -n "$CONTAINER_ON_PORT" ]; then
  docker rm -f $CONTAINER_ON_PORT 2>/dev/null || true
fi
echo "========== running docker container ============"
docker run -d --name redis-backend -p 8000:8000 --env-file .env redis-back:latest
echo "========== docker container running ============"
