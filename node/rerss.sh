ps -ef | grep rss.js | grep -v grep | awk '{print "sudo kill -9 "$2}' | sh
/usr/local/bin/node "$HOME"/zerro/radio/rss.js $1
