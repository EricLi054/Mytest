#!/bin/sh
# Start Redis server in the background
redis-server /usr/local/etc/redis/redis.conf --daemonize yes

# Wait for Redis server to start and be ready for connections
while ! redis-cli ping; do
   echo "waiting for redis-server..."
   sleep 1
done

# Pre-populate data
# Execute the Redis SET commands from redis-set.txt
cat /data/redis-set.txt | while read cmd; do
  redis-cli $cmd
done

echo "Config data init done."

# persist data to disk
redis-cli save 

# Stop the background Redis server
redis-cli shutdown

# Start Redis server in the foreground to keep the container running
redis-server /usr/local/etc/redis/redis.conf