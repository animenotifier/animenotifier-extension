#!/bin/sh

# Chrome
REPO=`basename "$PWD"`
cd ..
zip -r $REPO/arn-chrome.zip $REPO -x *.git*
cd $REPO

# Firefox
mv manifest.json manifest-chrome.json
cp manifest-firefox.json manifest.json
zip -r arn-firefox.xpi ./ -x *.git*
rm manifest.json
mv manifest-chrome.json manifest.json