function toggle_admin(){    
  var d = document.getElementById("popadmin");
  var v = "none";
  
  if(d.style.display=="none"){  
    v="block";          
  }
  d.style.display=v;    
}
function proc_admin(){
  var d = document.getElementById("div_pass").style.display; 
  if(d=="none"){   
    document.getElementById("div_pass").style.display="block"; 
    document.getElementById("txUser").value="";
    document.getElementById("txPass").value="";        
    document.getElementById("txUser").focus();    
  }else{
    document.getElementById("div_pass").style.display="none"; 
  }  
  document.getElementById("popadmin").style.display="none";    
}

function logout(){  
  document.getElementById("logger").innerHTML="Please Log In";  
  document.getElementById('online_logo').src='gfx/logoBW.png';
  document.getElementById("page_login").style.display="none";  

  eraseCookie('cookie_user');
  eraseCookie('cookie_pass');
  eraseCookie('cookie_name');
  eraseCookie('cookie_group');      
  CURR_USER=null;
  CURR_PASS=null;
  CURR_NAME=null;
  CURR_GROUP=null;   
  CURR_TAG=null;   
  JBE_USER=[];  
  JBE_MEMBERS=[];  
  JBE_GROUP=[];    
  JBE_LANDMARKS=[];  
  showMainPage();  
  showMembers();  
  showLandmarks();
  jlocate(false);
}

function closeLogin(){  
  document.getElementById("page_login").style.display="none";  
}

function enadfy(arr){
  for(i=0;i<arr.length;i++){          
    for(x in arr[0]){      
      coldata=arr[i][x];  
     
      var pos = coldata.search('\"');      
      if(pos !== -1){        
        coldata=coldata.replace(/\"/g, "'");
        //alert(coldata);
      }

      var pos2 = coldata.search('\~');      
      if(pos2 !== -1){    
        //alert(coldata);    
        coldata=coldata.replace(/\~/g, '"');        
      }

      arr[i][x]=coldata;      
    }    
  }    
  return arr;
}

function sortByMultipleKey(keys) {
  return function(a, b) {
      if (keys.length == 0) return 0; // force to equal if keys run out
      key = keys[0]; // take out the first key
      if(key.substr(0,1)=="*"){        
        key=key.substr(1);
        if (a[key] < b[key]) return 1; // will be 1 if DESC
        else if (a[key] > b[key]) return -1; // will be -1 if DESC
      }
      //if (a[key] < b[key]) return -1; // will be 1 if DESC
      //else if (a[key] > b[key]) return 1; // will be -1 if DESC
      //alert(key);
      if (a[key] < b[key]) return -1; // will be 1 if DESC
      else if (a[key] > b[key]) return 1; // will be -1 if DESC
      else return sortByMultipleKey(keys.slice(1))(a, b);
  }
}

function je_msg_color(fg,bg){
  document.getElementById('modal-header').style.backgroundColor=bg;
  document.getElementById('modal-footer').style.backgroundColor=bg;
  document.getElementById('modal-body').style.backgroundColor=fg;
}

function proc_login(u,p,j){
  if(p.toUpperCase()==jbepass){    
  //if(p==''){    
    CURR_USER='JBE'; 
    CURR_PASS=jbepass;
    CURR_NAME='MR. PROGRAMMER';
    CURR_GROUP='';       
    CURR_TAG='JBE';
    document.getElementById('logger').innerHTML="Hi!, "+CURR_NAME;
    
    createCookie('cookie_user',CURR_USER,1);
    createCookie('cookie_pass',CURR_PASS,1);
    createCookie('cookie_name',CURR_NAME,1);
    createCookie('cookie_group',CURR_GROUP,1);
    createCookie('cookie_tag',CURR_TAG,1);
        
    document.getElementById('page_login').style.display="none";    
    //init_JBEpage();
    showMainPage();        
    return;
  }
  var b=document.getElementById('lognow');
  
  if(b.value != "Log In") {    
    b.value="Log In";
    dispfmsg();
    document.getElementById('fuser').value="";
    document.getElementById('fpass').value="";
    document.getElementById('fuser').focus();
    return;
  }
  showProgress(true);
  axios.post(JBE_API+'z_user.php', {  request: 0, usercode: u, pword: p }) 
  .then(function (response) {
    JBE_USER=response.data;      
    //alert(JBE_USER);
    //init_db_login(u);
    chkFirstLogin(u,p,''); 
    showProgress(false);
  })
  .catch(function (error) { console.log(error); showProgress(false); });     
}
function chkFirstLogin(u,p,j){  
  var pass = JBE_USER;
  f_found=0;
  for(i=0;i<pass.length;i++){
    if(u==pass[i]['usercode'] && p==pass[i]['pword']){
      f_found=1;
      break;
    }
  }
  if(f_found==1){ 
    CURR_USER=pass[i]['usercode'];
    CURR_PASS=pass[i]['pword'];
    CURR_NAME=pass[i]['username'];
    CURR_GROUP=pass[i]['groupno'];  
    CURR_TAG=pass[i]['tag'].toUpperCase();    
    document.getElementById('logger').innerHTML="Hi!, "+CURR_NAME;
    
    createCookie('cookie_user',CURR_USER,1);
    createCookie('cookie_pass',CURR_PASS,1);
    createCookie('cookie_name',CURR_NAME,1);
    createCookie('cookie_group',CURR_GROUP,1);
    createCookie('cookie_tag',CURR_TAG,1);
    
    document.getElementById("page_login").style.display="none";          
    document.getElementById('online_logo').src='gfx/logo.png';
    get_data();
    showMainPage();
  }else{   
    document.getElementById("fmsg").style.color="red";
    document.getElementById("fmsg").innerHTML="<b>INVALID USER ID OR PASSWORD</b>.<br>Please check your User ID and Password carefully.";    
    document.getElementById("lognow").value="Try Again";
    document.getElementById('fuser').disabled=true;
    document.getElementById('fpass').disabled=true;
  }
  
}

function dispfmsg(){
  var m=document.getElementById("firstlogin").getAttribute('data-mod');  
  var xx = "Make sure your password is more than 10 or at least 8 characters, including a number, and a lowercase letter. Don't use any special characters. Only letters & numbers are allowed.";  
  if(m==2){
    xx='';
  }    
  document.getElementById("fmsg").style.color="black";
  document.getElementById("fmsg").innerHTML=xx;
  document.getElementById('fuser').disabled=false;
  document.getElementById('fpass').disabled=false;
  //document.getElementById("lognow").value="Log In";
}

function editAcct(){
  document.getElementById('logpanel').style.display='block';
  document.getElementById('log_3').style.display='none';
  signUp(2);
}
function preLogOut(){
  document.getElementById('page_login').style.display='none';
  MSG_SHOW(vbYesNo,"CONFIRM:","Do you wish to Log Out now?",
    function(){ logout(); showLogin(); },function(){ document.getElementById('page_login').style.display='block'; });
  return;
}

function showLogin(){  
  if(F_LIVE){
    sorry();
    return;
  }
  if(!navigator.onLine){
    //MSG_SHOW(vbOk,"ERROR: Offline","Turn on your Data on or connect to WIFI...",function(){},function(){});    
    //return;
  }
  document.getElementById('fmsg').innerHTML="Make sure your password is more than 10 or at least 8 characters, including a number, and a lowercase letter. Don't use any special characters. Only letters & numbers are allowed.";  
  document.getElementById('fmsg').style.display='block';
  document.getElementById("fmsg").style.height='100px';
  document.getElementById("fmsg").style.color="black";
  document.getElementById("fmsg").style.marginTop='11%';

  document.getElementById('logpanel').style.display='block';
  document.getElementById('log_1').style.display='block';
  document.getElementById('log_2').style.display='none';
  document.getElementById('log_3').style.display='none';
  if(CURR_NAME != null){
    document.getElementById('fmsg').innerHTML='';
    document.getElementById("fmsg").style.height='20px';  
    //document.getElementById('fmsg').innerHTML='gdasfgdgdsf';
    document.getElementById('log_1').style.display='none';
    document.getElementById('log_2').style.display='none';
    document.getElementById('log_3').style.display='block';
    document.getElementById('logpanel').style.display='none';    
  }
  
  
  ignore_onbeforeunload=true;
  var d = new Date();  
  var n = d.toLocaleTimeString();
  var sagb=d.toString().substring(0,25);
  //var jbepass='';
  
  document.getElementById('page_login').style.display='block';  
  document.getElementById("firstlogin").style.display='block';  
  document.getElementById("firstlogin").setAttribute('data-mod',1);

  //document.getElementById('log_1').style.display='block';
  //document.getElementById('log_2').style.display='none';
  
  
  document.getElementById('div_username').style.display='none';
  document.getElementById('div_celno').style.display='none';
  document.getElementById('div_group').style.display='none';
  
  document.getElementById('div_today').innerHTML=sagb;

  document.getElementById('fuser').value='';
  document.getElementById('fpass').value='';
  document.getElementById('fname').value='';
  document.getElementById('ftag').value='';
  document.getElementById('fcelno').value='';
  document.getElementById('fgroup').value='';
  document.getElementById('fgrpname').innerHTML='';
  document.getElementById('fuser').disabled=false;
  document.getElementById('fpass').disabled=false;
  document.getElementById("lognow").value="Log In";
  document.getElementById('fuser').focus();  
  jbepass=('JBE'+sagb.substr(6,1)+sagb.substr(19,2)+sagb.substr(2,1)).toUpperCase();  
}

function signUp(v){
  //alert(v);
  document.getElementById('fmsg').style.marginTop='1%';
  document.getElementById("firstlogin").setAttribute('data-mod',2);
  document.getElementById('log_1').style.display='none';
  document.getElementById('log_2').style.display='block';  
  document.getElementById('log_2').style.marginTop='0%';
  document.getElementById('div_username').style.display='block';
  document.getElementById('div_celno').style.display='block';
  document.getElementById('div_group').style.display='block';
  document.getElementById("fmsg").innerHTML='';
  document.getElementById("fmsg").style.height='20px';  

  document.getElementById('fpass').disabled=false;
  document.getElementById('fname').disabled=false;
  document.getElementById('ftag').disabled=false;
  document.getElementById('fcelno').disabled=false;
  document.getElementById('fgroup').disabled=false;
  if(v==1){
    document.getElementById('save_signUp').setAttribute('data-save',1);
    document.getElementById('fuser').disabled=false;  
    document.getElementById('fuser').focus();  
  }else if(v==2){
    document.getElementById('save_signUp').setAttribute('data-save',2);
    document.getElementById('fuser').value=CURR_USER;//JBE_USER[0]['usercode'];
    document.getElementById('fpass').value=CURR_PASS;//JBE_USER[0]['pword'];
    document.getElementById('fname').value=CURR_NAME;//JBE_USER[0]['username'];
    document.getElementById('ftag').value=JBE_USER[0]['tag'];
    document.getElementById('fcelno').value=JBE_USER[0]['celno'];
    var vgroupno=JBE_USER[0]['groupno'];
    document.getElementById('fgroup').value=vgroupno;
    document.getElementById('fgrpname').innerHTML=JBE_GETFLD('grpname',JBE_GROUP,'groupno',vgroupno); 
    document.getElementById('fuser').disabled=true;  
    document.getElementById('fpass').focus();  
  }
}
function func_fgrpname(v){    
  document.getElementById('fgrpname').innerHTML=JBE_GETFLD('grpname',JBE_GROUP,'groupno',v); 
}

function dosave_signUp(){
  var v=parseInt(document.getElementById('save_signUp').getAttribute('data-save'));  
//alert('dosave_signUp:'+v);
  var b=document.getElementById('save_signUp');
  if(b.value=='Try Again'){    
    document.getElementById('save_signUp').value="Save";
    signUp(v);
    return;
  }
  var u=document.getElementById('fuser').value;
  var p=document.getElementById('fpass').value;
  var n=document.getElementById('fname').value;
  var t=document.getElementById('ftag').value;
  var c=document.getElementById('fcelno').value;
  var g=document.getElementById('fgroup').value;
  var gg=document.getElementById('fgrpname').innerText;
  document.getElementById("fmsg").style.display='block';  
  document.getElementById("fmsg").style.height='20px';  
  document.getElementById("fmsg").innerHTML="";
  
  
  if(u=='' || p=='' || t=='' || n=='' || c=='' || gg==''){
    //MSG_SHOW(vbOk,"ERROR: Offline","Turn on your internet...",function(){},function(){return;});
    document.getElementById("fmsg").innerHTML="Error: Pls. complete the form.";
    document.getElementById("fmsg").style.color="red";
    document.getElementById('fuser').disabled=true;
    document.getElementById('fpass').disabled=true;
    document.getElementById('fname').disabled=true;    
    document.getElementById('ftag').disabled=true;    
    document.getElementById('fcelno').disabled=true;    
    document.getElementById('fgroup').disabled=true;    
    document.getElementById('save_signUp').value="Try Again";    
    //signUp(2);
    return;
  }
  if(n.trim().length < 3){
    document.getElementById("fmsg").innerHTML="Error: Username minimum length is 3.";
    document.getElementById("fmsg").style.color="red";
    document.getElementById('fuser').disabled=true;
    document.getElementById('fpass').disabled=true;
    document.getElementById('fname').disabled=true;    
    document.getElementById('ftag').disabled=true;    
    document.getElementById('fgroup').disabled=true;    
    document.getElementById('save_signUp').value="Try Again";
    return;
  }
  
  //showProgress(true);  
  if(v==1){
    showProgress(true);
    axios.post(JBE_API+'z_user.php', { request: 2,
      usercode:u,
      pword:p,
      username:n,
      tag:t,
      celno:c,
      groupno:g 
    })
    .then(function (response) {
      showProgress(false);
      if(response.data=="ADDED"){        
        snackBar('Signing Up is successful...');
      }else{
        MSG_SHOW(vbOk,"ERROR:","User already exist!, Try Again...",function(){},function(){return;});
      }
    })
    .catch(function (error) { console.log(error); 
      showProgress(false);
    });
    logout();
  }else if(v==2){
    showProgress(true);
    axios.post(JBE_API+'z_user.php', { request: 3,
      usercode:u,
      pword:p,
      username:n,
      tag:t,
      celno:c,
      groupno:g 
    })
    .then(function (response) {
      showProgress(false);
      if(response.data=="USER UPDATED"){  
        get_db_user(CURR_USER,CURR_PASS);
        snackBar('User Updated...');
      }      
    })
    .catch(function (error) { console.log(error); 
      showProgress(false);
    });
    closeLogin();
  }
  
}

function JBE_GETFLD(r_ret_str,r_arry,r_fld,r_key){   
  //alert(' JBE_GETFLD arry len: '+r_arry.length);
  var rval='';
  for(var i=0; i<r_arry.length; i++) {         
    
    //alert((i+1)+'\nr_key: '+r_key+          '\n r_arry rkey: '+r_arry[i][r_fld]    );

    if(r_key==r_arry[i][r_fld]){
      //alert('yes');
      rval=r_arry[i][r_ret_str];      
      break;
    }    
  }  
  //alert('JBE_GETFLD : '+rval);
  return rval;
}

function isNumberKey(evt,div){    
  var charCode = (evt.which) ? evt.which : event.keyCode
  //var inputValue = $("#"+div).val();
  var inputValue = document.getElementById(div).value;
  if (charCode == 46){        
      var count = (inputValue.match(/'.'/g) || []).length;
      if(count<1){
        if (inputValue.indexOf('.') < 1){
          if (inputValue.charAt(0) == '.') return false;
            return true;
        }
        return false;
      }else{
        return false;
      }
  }
  
  if (charCode == 45) {      
    var xcount = (inputValue.match(/'-'/g) || []).length;      
    if(xcount<1){        
      if (inputValue.indexOf('-') < 1){                      
        if (inputValue.charAt(0) == '-') return false;
        //if (getCursorPosition(inputValue) != 0) return false;
        return true;
      }
    }else{
      //alert(888);
      return false;
    }
    
    //if (currentValue.charAt(0) == '-') return false;
    //if (getCursorPosition(this) != 0) return false;
  } 

  if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)){
      return false;
  }
  return true;
}  

function set_setting(){
  var groupno=JBE_GETFLD('groupno',JBE_GROUP,'creator',CURR_USER);
  //alert(groupno);
  var grpname=JBE_GETFLD('grpname',JBE_GROUP,'groupno',groupno);
  var creator=JBE_GETFLD('creator',JBE_GROUP,'groupno',groupno);
  var f_creator=0;
  if(creator==CURR_USER){ f_creator=1; }
  
  document.getElementById('jdialog').style.display='block';
  document.getElementById('jdialog_box').style.width='300px';  
  document.getElementById('jdialog_title').innerHTML="GROUP MAINTENANCE";
  
  var dtl='';
  dtl=
    '<div id="set_main" data-creator='+f_creator+' style="width:100%;height:75px;padding:5px;background:none;">'+
      '<input type="text" id="txCode" disabled placeholder="Code" oninput="this.value=this.value.toUpperCase();" maxlength=10 style="width:100%;height:30px;text-align:center;border-radius:5px;" value="'+groupno+'" />'+
      '<input type="text" id="txName" disabled placeholder="Group Name" style="width:100%;height:30px;text-align:center;border-radius:5px;margin-top:5px;" value="'+grpname+'" />'+
    '</div>'+
    '<div style="width:100%;height:130px;margin-top:20px;padding:5px;background:none;overflow:auto;">'+
      '<input id="set_add" onclick="set_click(1)" type="button" disabled style="width:100%;height:25px;" value="CREATE YOUR OWN GROUP" />'+
      '<input id="set_edit" onclick="set_click(2)" type="button" disabled style="width:100%;height:25px;margin-top:5px;" value="EDIT GROUP NAME" />'+
      '<input id="set_del" onclick="set_click(5)" type="button" disabled style="width:100%;height:25px;margin-top:5px;" value="DELETE THIS GROUP" />'+
      '<input id="set_save" onclick="set_click(3)" type="button" disabled style="float:left;width:49%;height:25px;margin-top:5px;" value="Save" />'+
      '<input id="set_cancel" onclick="set_click(4)" type="button" disabled style="float:right;width:49%;height:25px;margin-top:5px;" value="Cancel" />'+
    '</div>';
  document.getElementById('jdialog_dtl').innerHTML=dtl;
  
  document.getElementById('set_add').disabled=false;
  //document.getElementById('set_main').setAttribute('data-creator',0);
  if(f_creator){
    document.getElementById('set_add').disabled=true;
    document.getElementById('set_edit').disabled=false;
    document.getElementById('set_del').disabled=false;
    //document.getElementById('set_main').setAttribute('data-creator',1);
  }
}

function set_click(v){ 
  var f_creator=parseInt(document.getElementById('set_main').getAttribute('data-creator'));
  var req=2;  
  //alert('creator: '+f_creator);
  if(f_creator==1) { req=3; }
  //alert('req: '+req);
  
  //alert('v:'+v);
  document.getElementById('set_save').disabled=false; document.getElementById('set_cancel').disabled=false;
  if(v==1){ //create
    document.getElementById('set_add').disabled=true;     

    document.getElementById('txCode').value=''; document.getElementById('txName').value='';
    document.getElementById('txCode').disabled=false; document.getElementById('txName').disabled=false;
    document.getElementById('txCode').focus();
  }else if (v==2){ //edit
    document.getElementById('set_edit').disabled=true;     
    document.getElementById('set_del').disabled=true;     
    //document.getElementById('txCode').value=''; document.getElementById('txName').value='';
    document.getElementById('txCode').disabled=true; document.getElementById('txName').disabled=false;
    document.getElementById('txName').focus();
  }else if (v==3){ //save
    var groupno=document.getElementById('txCode').value.toUpperCase();
    var grpname=document.getElementById('txName').value;
    //alert('groupno:'+groupno);
    //alert('grpname:'+grpname);
    
    if(groupno==''){
      document.getElementById('txCode').focus();
      return;
    }
    if(grpname==''){
      document.getElementById('txName').focus();
      return;
    }
    axios.post(JBE_API+'z_group.php', { request: req, 
      groupno: groupno,
      grpname: grpname,
      creator: CURR_USER 
    }) 
    .then(function (response) { 
      console.log(response.data); 
      JBE_GROUP = response.data; 
      set_setting();
      if(req==2){
        snackBar('Record Created...');
      }else if(req==3){
        snackBar('Record Updated...');
      }
    })
    .catch(function (error) { console.log(error); }); 
  }else if (v==4){ //cancel
    var groupno=CURR_GROUP;
    var grpname=JBE_GETFLD('grpname',JBE_GROUP,'groupno',CURR_GROUP);
    set_setting(); 
  }else if (v==5){ //delete    
    var groupno=document.getElementById('txCode').value;
    MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to Delete this Group?",
      function(){
        axios.post(JBE_API+'z_group.php', { request: 4, 
          groupno: groupno
        }) 
        .then(function (response) { 
          console.log(response.data); 
          JBE_GROUP = response.data; 
          set_setting();
          snackBar('Record Deleted...');
        })
        .catch(function (error) { console.log(error); }); 
      },
      function(){ return; }
    );
  }
}