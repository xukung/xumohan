#!/bin/bash

app='xmh';
version=$1;

if [ $version ]
then
    git reset --hard $version
else
    git reset --hard HEAD
fi
pm2 restart $app
