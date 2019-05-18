#!/bin/bash

app='xmh';

git pull
pm2 restart $app
