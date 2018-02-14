#!/usr/bin/env bash
##
# Update build files after making a production build
#

DEST_DIR="media/econplayground.js/"
ORIG_DIR="$HOME/public_html/econplayground.js/build/"

cp $ORIG_DIR/main.js $DEST_DIR/main-b.js
cp $ORIG_DIR/viewer.js $DEST_DIR/viewer-b.js
