echo " "
echo "..............................."
echo " "
echo "Update MPC ......."
mpc clear > /dev/null
mpc update > /dev/null
sleep 1

echo "Load radio ......."
mpc load radio > /dev/null
sleep 1

echo "Add Music/muzyka ......."
mpc add /home/pi/Music/muzyka/* > /dev/null
sleep 5

echo "Save mpc.m3u ......."
mpc rm mpc > /dev/null
mpc save mpc > /dev/null

echo "Start Play 1 ......."
mpc play 1
mpc playlist
echo " "
mpc play

echo "=======- KONIEC MPC UPDATE -=========="
echo " "
echo " "
