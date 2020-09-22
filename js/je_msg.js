const vbOk = '0';
const vbYesNo = '1';
const vbOkAbort = '2';
const vbPrompt = '3';

var MSG_FN1='';
var MSG_FN2='';
var rval="jeff";

function MSG_CLICK(v) {
  //alert('msg clikc');
  if(v==1) {
    //alert('first click');    
    MSG_FN1();  
  } else {
    //alert('second click');
    MSG_FN2();  
  }
  closeModal();
}
function closeModal(){  
  document.getElementById('je_msg').style.display='none';  
  //alert(getMsgBtn());
}

function MSG_SHOW(jmode,jtitle,jbody,fn1,fn2){  
  //fn1('eppy');
  //MSG_FN1=fn1(1,'sss');
  MSG_FN1=fn1;
  MSG_FN2=fn2;
  
  document.getElementById('je_msg').style.display = 'block';
  document.getElementById('DivPrompt').innerHTML=jtitle;
  document.getElementById('msgBody').innerHTML=jbody;

  document.getElementById('msgDivPrompt').style.display = 'none';
  document.getElementById('msgDivOk').style.display = 'none';
  document.getElementById('msgDivYesNo').style.display = 'none';

  document.getElementById('je_msg').focus();
  if(jmode=='0') {
    document.getElementById('msgDivOk').style.display = 'block';            
  } else if(jmode=='1') {          
    document.getElementById('msgDivYesNo').style.display = 'block';    
  } else if(jmode=='2') {    
    document.getElementById('msgDivYesNo').style.display = 'block';        
    document.getElementById('btnYes').value = 'OK';
    document.getElementById('btnNo').value = 'Abort';
  } else if(jmode=='32') { //prompt + Ok Abort
    document.getElementById('msgDivPrompt').style.display = 'block';    
    document.getElementById('msgDivYesNo').style.display = 'block';    
    document.getElementById('btnYes').value = 'OK';
    document.getElementById('btnNo').value = 'Abort';
    document.getElementById('txtPrompt').focus();
  }
}

