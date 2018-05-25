#!/usr/bin/env bash
##
# Set up symlinks for econplayground.js development
#

DEST_DIR="media/econplayground.js/"
ORIG_DIR="$HOME/public_html/econplayground.js/build/"

rm $DEST_DIR/*.js

ln -s $ORIG_DIR/editor.js $DEST_DIR/editor.js
ln -s $ORIG_DIR/viewer.js $DEST_DIR/viewer.js
