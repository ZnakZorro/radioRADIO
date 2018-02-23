ps -ef | grep oidar.js | grep -v grep | awk '{print "sudo kill -9 "$2}' | sh
/usr/local/bin/node "$HOME"/app/radio/oidar.js $1
