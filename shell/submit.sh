#!/bin/bash

msg=$1;


git add .
if [ $msg ]
then
    git commit -am "${msg}"
else
    git commit -am "it"
fi
git push
git status
