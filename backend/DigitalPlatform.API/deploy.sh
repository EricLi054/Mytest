#!/bin/sh
echo "---------- Building DigitalPlatform API ----------"
podman build -t digitalplatformapi .
echo "---------- Running DigitalPlatform API ----------"
podman container run -p 5078:5078 -d digitalplatformapi