<h1>mpd.conf for mpd </h1>

<h3>for audio analog or GPIO RPI Zero:</h3>
<a href="https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/etc/mpd.con.GPIO">mpd.conf.GPIO</a>
<pre>/etc/mpd.conf.GPIO</pre>


<h3>for USB DAC PCM2704:</h3>
<a href="https://raw.githubusercontent.com/ZnakZorro/radioRADIO/master/etc/mpd.conf.DAC">mpd.conf.DAC</a>
<pre>/etc/mpd.conf.DAC</pre>


<h4>Extra info:</h4>
<pre>sudo nano ~/.asoundrc</pre>

<pre>
pcm.!default {
    type hw
    card 1
}

ctl.!default {
    type hw
    card 0
}
</pre>


