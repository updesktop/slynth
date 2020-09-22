var aryNumOrder=[0,0,0,0,0,0,0,0];

function showJBEpage(){  
  //alert('showJBEpage');  
  
  clearScreen(0);    
  document.getElementById('page_main').style.display='block';
  document.getElementById('user_main').style.display='none';        
  document.getElementById('jbe_main').style.display='block';    
  document.getElementById('mnu_chat').style.display='block';    
  document.getElementById('mnu_edit').style.display='none';    
  window.scrollTo(0, 0);  
  document.getElementById('custom-img').style.display='block';
  showMenu(5);  
}
function dispClientsOnly(v){  
  
  var aryClients=CLIENT_USER;    
  var aryItems=CLIENT_TRANS;  
  /*
  alert(
    '\nCLIENT_USER: '+CLIENT_USER.length+
    '\nCLIENT_TRANS: '+CLIENT_TRANS.length+
    '\nCLIENT_TRANS2: '+CLIENT_TRANS2.length+
    '\nCLIENT_CHAT: '+CLIENT_CHAT.length);
  */
  var dtl='<div style="width:100%;height:100%;">';
  var bclor='white';
  
  var bg='white';
  var f_white=0;  
  var ctr=0;
  //document.getElementById('btnClientChat').disabled=true;
  //document.getElementById('btnClientChat').style.backgroundColor='green';
  document.getElementById('dtl_descrp').innerHTML='';
  document.getElementById('dtl_imgs').innerHTML='';    
  document.getElementById('dtl_chatmain').innerHTML=''; 
  document.getElementById('ctr_imgs').innerHTML=0;

  aryNumOrder=[0,0,0,0,0,0,0,0];
  aryItems.sort(sortByMultipleKey(['usercode'],['trano']));
  CURR_REC='';  
  for(var i=0;i<aryItems.length;i++){
    var ttype=parseInt(aryItems[i]['trantype']);
    
    if(v != '' && ttype != v){      
      continue;
    }
    ctr++;

    var ttrano=aryItems[i]['trano'];
    var tclient=aryItems[i]['usercode'];
    var tdescrp=aryItems[i]['descrp'];
    var msgColor=retUnreadMsg(ttrano);
    
    //                        r_ret_str,r_arry,  r_fld,   r_key
    
    var user_name=JBE_GETFLD('username',aryClients,'usercode',tclient);  
    //alert('tclient: '+tclient+      '\nusername: '+user_name    );
    var user_order=document.getElementById('hd_'+ttype).innerText;
    aryNumOrder[ttype]++; // array orders counter
        
    dtl=dtl+
    '<div id="c_line'+ttrano+'" data-clor="'+bclor+'" data-sel=0 data-row='+i+' onmouseover="subHover(this.id,1,&quot;'+ttrano+'&quot;,&quot;red&quot;)" onmouseout="subHover(this.id,0,&quot;'+ttrano+'&quot;,&quot;none&quot;)"'+
        'onclick="showItemDtl('+i+',&quot;'+ttrano+'&quot;,&quot;'+ttype+'&quot;,&quot;'+tclient+'&quot;,&quot;'+tdescrp+'&quot;)" style="width:100%;height:30px;font-size:12px;color:'+msgColor+'; background-color:'+bclor+';margin-top:0px;border:0px solid gray;">'+
      '<div style="float:left;width:28%;height:100%;margin-right:0px;border:1px solid gray;background:none;">'+user_name+'</div>'+      
      '<div style="float:left;width:20%;height:100%;margin-right:0px;border:1px solid gray;background:none;">'+user_order+'</div>'+
      '<div style="float:left;width:30%;height:100%;margin-right:0px;border:1px solid gray;background:none;">'+aryItems[i]['trano']+'</div>'+
      '<div style="float:left;width:22%;height:100%;margin-right:0px;border:1px solid gray;background:none;">'+aryItems[i]['trandate']+'</div>'+      
    '</div>';
    
    if(f_white==0) {				
      bclor="lightgray";
      f_white=1;
    }	else {
      bclor="white";
      f_white=0;
    }		
  }
  dtl=dtl+'</div>';

  document.getElementById('dtl_clients').innerHTML=dtl;
  document.getElementById('tot_clients').innerHTML=ctr;      
  dispUnreadMsg('');    
  showNumOrders(true);  
  //document.getElementById("loading").style.display='none';
}

function retUnreadMsg(v){ 
  console.log(CLIENT_CHAT.length);
  //alert('retUnreadMsg: '+CLIENT_CHAT.length)
  var rval='black';
  for(var i=0;i<CLIENT_CHAT.length;i++){    
    if(v==CLIENT_CHAT[i]['trano']){
      rval='red';
      break;
    }
  }
  //alert(rval);
  return rval;
}

function dispUnreadMsg(v){  
  var ctr_msg2=0;
  for(var i=0;i<CLIENT_CHAT.length;i++){    
    if(v != '' && v != CLIENT_CHAT[i]['usercode']){ continue; }
    if(CLIENT_CHAT[i]['unread'] != '0' || CLIENT_CHAT[i]['sender'] != '0'){ continue; }
    ctr_msg2++;
  }
  //alert(v+' unread msg: '+ctr_msg2);
  document.getElementById('tot_unread').innerHTML=ctr_msg2;
}

function showItemDtl(ii,xtrano,xtrantype,xclient,xdescrp){    
  setRecord(xtrano);

  refno=xtrano;
  reftype=xtrantype;
  descrp=xdescrp;
  CURR_CLIENT=xclient;
  
  document.getElementById('dtl_descrp').innerHTML=descrp;
  showMenu(2);
  var dtl2='';  
  var vCtrImgs=0;
  
  for(i=0;i<CLIENT_TRANS2.length;i++){
    
    if(xtrano != CLIENT_TRANS2[i]['trano']) { 
      continue; 
    }
    vCtrImgs++;

    var ximg='upload/'+CLIENT_TRANS2[i]['photo'];

    dtl2=dtl2+    
      
      '<div style="display:block;float:left;position:relative;width:80px;height:80px;background:black;">'+        
        '<img src="'+ximg+'" style="width:100%;height:100%;border:1px solid gray;"/>'+
        '<a href="'+ximg+'" download="">'+
          '<div style="width:25px;height:25px;position:absolute;top:5px;left:5px;padding:2px;border:1px solid black;border-radius:7px;background:lightgray;">'+
            '<img src="gfx/jdown.png" style="width:100%;"/>'+
          '</div>'+
        '</a>'+
        '<div onclick="zoomit(&quot;'+CLIENT_TRANS2[i]['photo']+'&quot;)" style="width:30px;height:30px;position:absolute;top:5px;right:5px;border-radius:10px;background:none;">'+
          '<img src="gfx/jzoom.png" style="width:100%;"/>'+
        '</div>'+       
      '</div>';
  }  
  document.getElementById('dtl_imgs').innerHTML=dtl2;    
  document.getElementById('ctr_imgs').innerHTML=vCtrImgs;
  dispClientChatDtl();  
}

function showNumOrders(f){  
  for(var i=0;i<8;i++){
    if(f){
      if(aryNumOrder[i] != 0){
        document.getElementById('num_order_'+i).style.display='block';
        document.getElementById('num_order_'+i).innerHTML=aryNumOrder[i];  
      }    
    }else{
      aryNumOrder[i]=0;
      document.getElementById('num_order_'+i).style.display='none';
    }
  }
}

function getClientChats(){  
  //document.getElementById("loading").style.display='block';
  CLIENT_CHAT=[];
  showProgress(true);     
  axios.post(JBE_API+'z_chat.php', { request: 1 }) 
  .then(function (response) {         
    CLIENT_CHAT = response.data;
    console.log(response.data);
    dispClientChatDtl();
    showProgress(false);     
  })    
  .catch(function (error) { console.log(error); showProgress(false);  }); 
}
function dispClientChatDtl(){   
  //alert('inside dispClientChatDtl'); 
  var aryChat=CLIENT_CHAT;
  
  aryChat.sort(sortByMultipleKey(['id']));  
  var dtl='';
  var v_color='';
  var bg='lightgray';
  var vdisp='block';
  var v_msg_color='black';
  var ctr_msg2=0;  
  document.getElementById('div_chat').innerHTML=dtl;
  for(var i=0;i<aryChat.length;i++){
    if(aryChat[i]['trano'] != refno){
      continue;
    }            
    var v_msg=aryChat[i]['msg'];
    var v_img=''; var v_img_h=0;
    var img='';
    if(aryChat[i]['photo'] != ''){    
      v_img='upload/'+aryChat[i]['photo'];    
      v_img_h=150;
      img=aryChat[i]['photo'];    
    }
    var v_idx=aryChat[i]['id'];
    var v_community='';
    var v_projcode=aryChat[i]['trano'];
    var v_date=aryChat[i]['trandate'];
    var v_time=aryChat[i]['trantime'];
    var v_unread=aryChat[i]['unread'];
    var v_sender=aryChat[i]['sender'];

    v_msg_color='black';
    if(v_unread=='0' && v_sender=='0'){ v_msg_color='red'; }

    if(v_sender==0){
      v_color='lightgray';
      dtl = dtl +
        '<div id="'+v_idx+'" class="class_msg" style="width:100%;height:auto;font-size:9px;text-align:left;color:black;background-color:none;">'+            
          '<div style="float:left;margin-left:1%;width:100%;height:auto;margin-top:5px;font-size:14px;background-color:none;">'+v_date+' '+v_time+'</div>'+
          '<div style="float:left;margin-left:1%;width:60%;border-radius:10px;text-align:left;padding:0.5%;background-color:'+v_color+';">'+          
          '  <span style="float:left;width:100%;font-size:16px;border-radius:5px;text-align:left;padding:1%;color:'+v_msg_color+';background-color:none;">'+v_msg+'</span>'+              
          '</div>'+
        '</div>';
    }else{
      v_color='lightgreen';
      dtl = dtl +            
        '<div id="'+v_idx+'" class="class_msg" style="width:100%;height:auto;text-align:right;background-color:none;">'+
          '<div style="float:right;margin-right:1%;width:100%;height:auto;margin-top:5px;font-size:14px;background-color:none;">Date:'+v_date+'&nbsp;&nbsp;&nbsp;&nbsp;Time:'+v_time+'</div>'+
          '<div style="float:right;margin-right:1%;width:70%;border-radius:10px;padding:0.5%;background-color:'+v_color+';">'+
            '<div id="chatdel_'+v_idx+'"  title="Delete this chat" style="display:'+vdisp+';width:100%;height:20px;text-align:center;font-size:14px;cursor:pointer;background-color:none;color:white;">'+
              '<span onclick="delClientChat('+v_idx+',&quot;'+v_img+'&quot;)" style="float:right;width:15px;border-radius:5px;background:red;">X</span>'+
            '</div>'+
            '<div style="float:left;width:100%;text-align:right;font-size:16px;border-radius:5px;padding:1%;background-color:none;">'+
                '<div style="height:'+v_img_h+'px;"><img src="'+v_img+'" style="width:auto,height:auto;max-width:100%;max-height:100%;" onclick="zoomit(&quot;'+img+'&quot;)" /></div>'+
                '<span>'+v_msg+'</span>'+
            '</div>'+              
          '</div>'+
        '</div>';
    }
    ctr_msg2++;
  }
  document.getElementById('tot_unread').innerHTML=ctr_msg2;
  var eldiv = document.getElementById("dtl_chatmain");  
  eldiv.innerHTML=dtl;  
  eldiv.scrollTop = eldiv.scrollHeight;
  //document.getElementById("loading").style.display='none';
}

function delClientChat(jid,jfile){  
  //alert(jid+' vs '+jfile);
  //return;

  MSG_SHOW(vbYesNo,"CONFIRM:","Are you sure to Delete this Item?",
    function(){    
      showProgress(true);  
      axios.post(JBE_API+'z_chat.php', {
        request: 44,
        item: jfile,
        id: jid
      })
      .then(function (response) {
        //alert(response.data);
        getClientChats(); 
        console.log(response.data);  
        showProgress(false);     
      })
      .catch(function (error) {
        console.log(error);
        showProgress(false);     
      });
    },
    function(){
      return;
    }); 
}

function sendClientMsg(){ 
  //alert('JBE ni. ttype='+reftype);
  //document.getElementById("loading").style.display='block';    
  var newName='';
  var txtMsg=document.getElementById('txtMsg').value;  
  var vDate=new Date();
  var vTime=vDate.toLocaleTimeString();

  vDate = new Date(vDate.getTime() - (vDate.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
  
  if(thisFile != undefined && thisFile != ''){      
    newName = 'JBE_'+new Date().getTime() + '.'+getExt(thisFile.name);
    uploadNOW(thisFile,newName,'bar2');
    document.getElementById('pre_img').src='gfx/jimage.png';   
  }                    
  if(txtMsg != '' || newName != ''){
    showProgress(true);
    axios.post(JBE_API+'z_chat.php', { request: 2,
      usercode: CURR_CLIENT,
      trano: refno,
      trantype: reftype,
      photo: newName,
      sender: 1,
      trandate: vDate,
      trantime: vTime,
      msg: txtMsg      
    })
    .then(function (response) {      
      //alert(response.data);
      console.log(response.data);
      showProgress(false);
      getClientChats();      
      snackBar('Message Sent...');
      document.getElementById('txtMsg').value='';     
      newName='';
      thisFile='';
    })
    .catch(function (error) {
      console.log(error);      
      showProgress(false);
    });
  }else{
    snackBar('Fill all fields.');showProgress(false);
  } 
}
