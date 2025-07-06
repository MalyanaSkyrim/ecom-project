echo Running ecom-"$1":latest

docker run \
  --rm -it \
  --platform linux/amd64 \
  --env-file=".env" \
  -p4000:4000 \
  --name ecom-"$1"-container \
  --entrypoint sh \
  -e REDIS_URL=redis://ecom-project-redis-dev:6379 \
  --network ecom-project_default \
  ecom-"$1":latest
