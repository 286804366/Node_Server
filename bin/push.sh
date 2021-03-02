#!/bin/sh
git add .
git commit -am 'push'
git push origin
git push autohub
exit 1