/*GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET */
app.get("/*", function(req, res){
   let info = 'radioget';
   let getparam = req.url.split('/').slice(1);
   console.log('getparam=',getparam);
   if (getparam[0]==='radio' && getparam[1]){
      let param = getparam[1];
      console.log('param=',param);
      if (param=="0") param="stop";
      var mpcexe = "mpc play "+param;
      if (param=="stop" || param=="play" || param=="current" || param=="next" || param=="prev" || param=="pause"|| param=="playlist" ) mpcexe = "mpc "+param;
      if (param=="info") mpcexe = "mpc";
      if (param=="seek") mpcexe = "mpc seek +20%";
         try {
            info = execSync(mpcexe).pars();
         } catch(err) {
            info = err.stderr.toString();
         }
   } // eof /radio
	var ret  = parseMpcInfo(info);
	sendInfo(res,ret);
});
/*GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET GET */
