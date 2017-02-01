mpc clear
sleep 1
mpc update
sleep 1
mpc load radio
sleep 1
mpc add /home/pi/Music/muzyka/
sleep 5
mpc rm mpc
sleep 1
mpc save mpc
sleep 1
mpc play 1

echo "=======- KONIEC MPC UPDATE -=========="
