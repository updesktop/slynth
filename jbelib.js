function JBE_OPENBOX(div,title,dtl,dtl2) {   
  var div_dtl=    
    '<div id="myJBox_main" data-open=0 data-close="" class="bottom_box" style="background:'+JBE_CLOR+';">'+
      '<div id="hd_jbox" class="hd_box" style="width:100%;height:30px;font-size:15px;font-weight:bold;border:1px solid black;background:none;">'+        
        '<div style="float:left;width:10%;height:100%;background:none;">'+
          '<input type="button" onclick="JBE_CLOSEBOX()" style="width:28px;height:100%;font-size:14px;color:white;border-radius:50%;border:1px solid white;background:red;" value="X" />'+
        '</div>'+
        '<div id="cap_jbox" style="float:right;text-align:right;width:90%;height:100%;padding:5px;color:'+JBE_TXCLOR1+';background:none;">'+title+'</div>'+
      '</div>'+      
      '<div id="dtl_jbox" style="width:100%;height:auto;padding:5px;overflow:auto;border:1px solid black;color:black;background:white;">'+
        dtl+
      '</div>'+
      '<div id="footer_jbox" class="jfooter" style="display:block;height:50px;width:100%;color:'+JBE_TXCLOR1+';background:'+JBE_CLOR+';">'+
        dtl2+
      '</div>'+    
    '</div>';
  
  document.getElementById("myJBox").innerHTML=div_dtl;  
  //document.getElementById("myJBox_main").setAttribute('data-close',xclose);
  document.getElementById("myJBox").style.height = window.innerHeight+'px';
  //document.getElementById("cap_jbox").innerHTML=title;
  //document.getElementById("dtl_jbox").innerHTML=dtl;
  
  var h=parseInt(document.getElementById(div).style.height); 
  var hh=h+30+50; //dtl height + box head height + paddings         
  document.getElementById("dtl_jbox").style.height = h+'px';
  document.getElementById("myJBox_main").style.height = hh+'px';
  document.getElementById("myJBox").style.height = window.innerHeight+'px';
  document.getElementById(div).style.height="auto";
  document.getElementById(div).style.width="100%";
  document.getElementById(div).style.height = (h-12)+'px';
}

function JBE_CLOSEBOX(){  
  var xclose=document.getElementById("myJBox_main").getAttribute('data-close'); 

  document.getElementById("myJBox").style.height=0+'px';
  document.getElementById("myJBox_main").style.height = 0+'px';       
  
  document.getElementById("myJBox").style.height = "0px";       
  document.getElementById("myJBox").setAttribute('data-open','0');   
  // find object
  var fn = window[xclose];
  // is object a function?
  if (typeof fn === "function") fn();
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


function JBE_ZOOM(img,div_close){
  var dtl=      
    '<div id="main_JBE_zoom" data-zoom=0 data-close="'+div_close+'" style="width:100%;height:'+(H_BODY-100)+'px;text-align:center;background-color:none;">'+      
      '<img id="img_JBE_zoom" onclick="JBE_zoom2()" src="'+img+'" style="width:100%;height:auto;">'+
    '</div>';
  var dtl2=      
    '<div style="width:100%;height:100%;padding:11px 0 0 0;text-align:center;color:white;background:none;">'+
      'Click the Image to Zoom In or Zoom Out'+      
    '</div>';   
  JBE_OPENBOX('main_JBE_zoom','Zoom Image',dtl,dtl2); 
}

function close_JBE_ZOOM(){
  var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
  var fn = window[closeDiv];
  if (typeof fn === "function") fn();
}

function JBE_zoom2(){
  var div=document.getElementById('main_JBE_zoom');
  var mod=parseInt(document.getElementById('main_JBE_zoom').getAttribute('data-zoom'));
  var divImg=document.getElementById('img_JBE_zoom').src;
  var img_w=0;
  var img_h=0;
  var ximg = new Image();
  ximg.src=divImg;  
  ximg.onload = function() {
    img_w=ximg.naturalWidth;
    img_h=ximg.naturalHeight;
    
    var imageratio = img_w/img_h;

    var new_width = H_BODY*imageratio;
    var new_height = H_BODY;

    if(mod==0){
      div.style.height=new_height+'px';
      div.style.width=new_width+'px';
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',1));      
    }else{
      div.style.height="auto";
      div.style.width="100%";
      (document.getElementById('main_JBE_zoom').setAttribute('data-zoom',0));
    }
  }
}

function JBE_PICK_IMAGE(inp_file,targ_div,cb){
  //alert(targ_div);
  //var closeDiv=document.getElementById('main_JBE_zoom').getAttribute('data-close');
  thisFile=null;
  const real_ImgBtn = document.getElementById(inp_file);
  real_ImgBtn.setAttribute("accept","image/*"); //accept="image/*"    

  real_ImgBtn.addEventListener("change", function() {
    if (real_ImgBtn.value) {
      var reader = new FileReader();
      var imgSize=event.target.files[0].size;
      reader.onload = function(){
        if(imgSize > 6000000){
          MSG_SHOW(vbOk,"ERROR: ","File is too big. Maximum is 6mb.",function(){},function(){});
          return;
        }
        var output = document.getElementById(targ_div);
        output.src = reader.result;
        var fn = window[cb];
      if (typeof fn === "function") fn(reader.result);
        //document.getElementById('tmp').src=reader.result;
      };
      reader.readAsDataURL(event.target.files[0]);
      thisFile=this.files[0];
      document.getElementById(targ_div).setAttribute('data-img',thisFile.name);
      real_ImgBtn.value='';      
    } 
  });
  real_ImgBtn.click();
}
  
function JBE_GETFLD(r_ret_str,r_arry,r_fld,r_key){   
  //alert(' JBE_GETFLD arry len: '+r_arry.length);
  var rval='';
  for(var i=0; i<r_arry.length; i++) {
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i][r_ret_str];      
      break;
    }    
  }    
  return rval;
}

function JBE_GETARRY(r_arry,r_fld,r_key){   
  //JBE_GETFLD('usertype',DB_CLIENTS,'usercode',usercode);  
  var rval=[];
  for(var i=0; i<r_arry.length; i++) {    
    if(r_key==r_arry[i][r_fld]){
      rval=r_arry[i];
      //alert(rval['clientno']);
      break;
    }
  }      
  return rval;
}

function JBE_IMG_EXIST(v_img){
  var img = document.createElement('img');

  img.src=v_img;

  img.onload = function(e){
    //alert('Success!');
    return true;
  };

  img.onerror = function(e) {
    //alert('ERROR!');
    return false;
  };
}



//enad