var JBE_STORE_IDX = [  
  { "id":0, "flename":"SysFile", "numrec":0 , "init":1 },
  { "id":1, "flename":"User", "numrec":0 , "init":1 }
];

function start_app(){
  //allow_start(false);
  JBE_ONLINE_NAVI=navigator.onLine;    
  JBE_ONLINE=false;   
  //****************
  //JBE_ONLINE_NAVI=true;
  //****************  
  document.getElementById('coorPanel').style.display='block';  
  axios.post(JBE_API+'z_user.php', { request:0 } )     
  .then(function (response) {
    if(parseInt(response.data.length) > 0 && JBE_ONLINE_NAVI){
      // alert('start app '+response.data.length);
        showOnline();
    }else{
      //alert('wala');
      showOffline();
    }    
    showMainPage();       
  })
  .catch(function (error) { 
    alert('naunsa na! '+error);
    //snackBar('ERROR: '+error)
    if (!error.response) {
      // network error (server is down or no internet)
      console.log('JBE Found: network error (server is down or no internet)');
    } else {
      // http status code
      const code = error.response.status;
      // data from server while error
      const response = error.response.data;
      //console.log(code+' vs '+response);
      MSG_SHOW(vbOk,"INTERNAL ERROR:","CODE:"+code+". Server Response: "+response+". <br>Please Refresh.",function(){},function(){}); 
    }
    showOffline();          
  });
}

function showOnline(){
  var d = new Date();  
  var n = d.toLocaleTimeString();
  JBE_ONLINE=true;    
  
  get_db_tanan(); 
  jlocate(false);  
  document.getElementById('jtime').innerHTML=''; 
  document.getElementById('jtime').innerHTML=d.toString().substring(0,15);  
}

function showOffline(){    
  JBE_ONLINE=false;
  //dispMenu(true,'mnu_main');    
  //getAllDataFromIDX(0);
  //showSystem();
  document.getElementById('jtime').innerHTML='OFFLINE';
  //document.getElementById('div_bar').style.display='block';  
  allow_start(true);
  //showMainPage(); 
}

function allow_start(v){
  var vv='none';
  showProgress(true);
  if(v){ vv='auto'; showProgress(false); }
  document.getElementById('wrapper').style.pointerEvents=vv;
}

function callText(m,n){    
  alert(m+' vs '+n);
  //ignore_onbeforeunload=true;
  if(m=='call') {
    //alert('call');
    //window.location.href="tel:+63-948-952-3337";
    window.location.href="tel:"+n;
  }else if(m=='txt') {
    //window.location.href="sms://+639489523337?body=I%27m%20interested%20in%20your%20product.%20Please%20contact%20me."
    window.location.href="sms://"+n+"?body=Please%20contact%20me."
    //alert('text');
  }
}


