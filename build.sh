#!/bin/sh

# Delete old versions
rm arn-chrome.zip
rm arn-firefox.xpi

# Chrome
REPO=`basename "$PWD"`
cd ..
zip -r $REPO/arn-chrome.zip $REPO -x *.git* -x *.zip* -x *.xpi* -x *.sh
cd $REPO

# Firefox
mv manifest.json manifest-chrome.json
cp manifest-firefox.json manifest.json
zip -r arn-firefox.xpi ./ -x *.git* -x *.zip* -x *.xpi* -x *.sh -x manifest-*.json -x README.md -x LICENSE
rm manifest.json
mv manifest-chrome.json manifest.json