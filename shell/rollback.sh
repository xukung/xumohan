#!/bin/bash

version=$1;

if [ $version ]
then
    git reset --hard $version
else
    git reset --hard HEAD
fi
pm2 restart all
