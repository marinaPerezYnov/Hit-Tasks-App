#!/bin/bash

if [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "up" ]]; then
    cd ..
    fileEnv="docker-compose.${1}.yaml"
    up=$2
    build=--build
    echo "Running -> docker-compose -f docker-compose.yaml -f $fileEnv $up $build"
    docker-compose -f docker-compose.yaml -f "$fileEnv" "$up" "$build"
elif [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "stop" ]]; then
    cd ..
    stop=$2
    echo "Stop all containers. Running docker-compose $stop"
    docker-compose "$stop"
elif [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "down" ]] && [[ $3 = "volumes" ]]; then
    cd ..
    fileEnv="docker-compose.${1}.yaml"
    down=$2
    volumes=--volumes
    echo "Stop and remove all containers and volumes. Running docker-compose docker-compose.yaml -f $fileEnv $down $volumes"
    docker-compose -f docker-compose.yaml "$fileEnv" "$down" "$volumes"
elif [[ $1 = "prod" || $1 = "dev" ]] && [[ $2 = "down" ]]; then
    cd ..
    fileEnv="docker-compose.${1}.yaml"
    down=$2
    echo "Stop and remove all containers. Running docker-compose -f docker-compose.yaml -f $fileEnv $down"
    docker-compose -f docker-compose.yaml -f "$fileEnv" "$down"
else
    echo 'Need to follow format ./deploy prod|dev down|up'
fi