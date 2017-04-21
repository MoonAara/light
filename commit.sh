#!/bin/bash

eval "$(ssh-agent -s)"
ssh-add ~/.ssh/moonaara

git add .
git commit -m \"$1\"
git push
