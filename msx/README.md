
Build phaser.msx.js
  coyote -w msx/:phaser.msx.js

Add background image to multiple images
  WARNING: this changes the images in place; so copy them first
  mogrify tmp/*.png -background '#250918' -alpha remove

Convert images to video
  ffmpeg -r 30 -s 1920x1080 -i tmp/%04d.png -vcodec libx264 -crf 25 -pix_fmt yuv420p assets/winners.mp4

Serve files (node.js) - SimpleHTTPServer doesn't work for video
  http-server -p 8000
