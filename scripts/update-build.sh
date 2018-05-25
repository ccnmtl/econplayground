#!/usr/bin/env bash
##
# Update build files after making a production build
#

DEST_DIR="media/econplayground.js/"
ORIG_DIR="$HOME/public_html/econplayground.js/build/"

cp $ORIG_DIR/editor.js $DEST_DIR/editor.js
cp $ORIG_DIR/viewer.js $DEST_DIR/viewer.js
