echo " "
echo "..............................."
echo " "
echo "Update MPC ......."
mpc clear
mpc update
sleep 1
echo " "
echo "Load radio ......."
mpc load radio
sleep 1
echo " "
echo "Add Music/muzyka ......."
mpc add /home/pi/Music/muzyka/
sleep 5
echo " "
echo "Save mpc.m3u ......."
mpc rm mpc
mpc save mpc
echo " "
echo "Start Play 1 ......."
mpc play 1

echo "=======- KONIEC MPC UPDATE -=========="
echo " "
echo " "
