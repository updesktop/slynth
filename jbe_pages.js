function showMainPage(){  
  //alert('ako main page');
  f_MainPage=true;
  document.getElementById("myView1").setAttribute('data-JBEpage',0); //reset openview page to 0
  if(f_reload){
    snackBar('Press Back key to Exit');    
    f_reload=false;
  }
  //snackBar('ERROR:<br>the quick brown fox jumps over the lazy dog near the bank of the river. the quick brown fox jumps over the lazy dog near the bank of the river.');
  /*
  if(CURR_USER==null){
    plsLogin();
    return; 
  } 
  */ 
  openPage('page_main');  
  //showMenu('mnu_main'); 
  var vmenu='mnu_mainmenu';  
  var v_curr_user=CURR_USER;    
  if(CURR_AXTYPE > 0){ 
    v_curr_user=''; //user current client
    vmenu='mnu_mainmenu';
  }
  dispMenu(true,vmenu);
  if(!JBE_ONLINE) { return; }

  if(!F_LIVE){    
    showMembers();
    showLandmarks();
    jlocate();
  }else{
    sorry();
  }
}

function clearScreen(modex){    
  var vdisp='none';  
  var xtop=document.getElementById('div_header').style.height;
  ignore_onbeforeunload=true;

  //document.getElementById('mnu_home').style.display='block';
  //document.getElementById('mnu_back').style.display='none';
  //document.getElementById('mnu_admin').style.display='block';
  
  if(modex != 0){    
    ignore_onbeforeunload=false;
    //document.getElementById('mnu_home').style.display='none';
    //document.getElementById('mnu_back').style.display='block';
    //document.getElementById('mnu_admin').style.display='none';
  }
  
  document.getElementById('wrapper').style.marginTop=xtop;  
  document.getElementById('div_sap').style.display=vdisp;      
  document.getElementById('page_main').style.display=vdisp;  
  document.getElementById('page_login').style.display=vdisp; 
}

function setRecord(xtrano){
  //return;
  //alert('currec: '+CURR_REC+' vs xtrano: '+xtrano);
  var bg='red';
  //bg='lightgreen';
  //bg='lightblue';
  
  if(CURR_REC != ''){
    var w = document.getElementById('c_line'+CURR_REC);
    var obg = w.getAttribute('data-clor');      
    w.style.backgroundColor=obg;
    w.setAttribute('data-sel',0);    
  }
  
  var x = document.getElementById('c_line'+xtrano);
  x.style.backgroundColor=bg;
  x.setAttribute('data-sel',1);  
  CURR_REC=xtrano;
}

function subHover(div,n,i,c){    
  var datasel=document.getElementById(div).getAttribute('data-sel');
  
  if(datasel==1) {   
    return; 
  }   
    
  var obg=document.getElementById(div).getAttribute('data-clor');
 
  if(n==1){
    document.getElementById(div).style.backgroundColor='lightblue';
  } else {    
    document.getElementById(div).style.backgroundColor=obg; 
  }
}

function sorry(){
  snackBar('Disabled, we are LIVE...');
}
function plsLogin(){
  MSG_SHOW(vbOk,"YOU ARE NOT LOGGED IN","Please enter your User ID and Password at Log-In area.",
      function(){},
      function(){});
}

function openGroup() {    
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  
  if(CURR_USER==null) { plsLogin(); return; }
  if(F_LIVE) { sorry(); return; }

  //document.getElementById("myGroup").style.height = "110px";       
  //document.getElementById("myGroup").setAttribute('data-open',1); 
  var bclor='white';  
  var f_white=0;  
  var dtl='<div id="myGroup" style="width:100%;height:'+(H_WRAPPER/3)+'px;overflow:auto;background:none;">';
  
  var aryDB=DB_MEMBERS;

  for(var i=0;i<aryDB.length;i++){
    if(aryDB[i]['usercode']==CURR_USER){ continue; }
    if(aryDB[i]['groupno']!= CURR_GROUP) { continue; }
    var ttrano=aryDB[i]['usercode'];
    var vlat=parseFloat(aryDB[i]['lat']);
    var vlng=parseFloat(aryDB[i]['lng']);
    
    dtl=dtl+
    '<div id="c_line'+ttrano+'" data-clor="'+bclor+'" data-sel=0 data-row='+i+' onmouseover="subHover(this.id,1,&quot;'+ttrano+'&quot;,&quot;red&quot;)" onmouseout="subHover(this.id,0,&quot;'+ttrano+'&quot;,&quot;none&quot;)"'+
        'onclick="gotoMember(&quot;'+ttrano+'&quot;,'+vlat+','+vlng+')" style="width:100%;height:25px;font-size:14px;background-color:'+bclor+';margin-top:0px;border:0px solid gray;">'+
      '<div style="float:left;width:20%;height:100%;padding:2px;text-align:center;border:1px solid gray;background:none;">'+aryDB[i]['tag']+'</div>'+      
      '<div style="float:left;width:80%;height:100%;padding:2px;margin-right:0px;border:1px solid gray;background:none;">'+aryDB[i]['username']+'</div>'+
    '</div>';
    
    if(f_white==0) {				
      bclor="lightgray";
      f_white=1;
    }	else {
      bclor="white";
      f_white=0;
    }		      
  }

  dtl+='</div>';

  var dtl2=
    '<div style="width:100%;height:100%;">'+
      '<div style="width:100%;height:100%;padding:15px 0 0 0;text-align:center;background:red;">'+
        'Select a Member'+
      '</div>'+
    '</div>';  
  JBE_OPENBOX('myGroup','My Group',dtl,dtl2);  
}
function closeGroup(){
  //document.getElementById("myGroup").style.height = "0px";       
  //document.getElementById("myGroup").setAttribute('data-open','0'); 
  clearInterval(LOC_MEMBERS);
}

function openLandmark() {    
  window.history.pushState({ noBackExitsApp: true }, '');
  f_MainPage=false;
  
  if(CURR_USER==null) { plsLogin(); return; }
  if(F_LIVE) { sorry(); return; }
  var bclor='white';  
  var f_white=0;  
  var dtl='<div id="myLandmark" data-mode=0 style="width:100%;height:'+(H_WRAPPER/3)+'px;overflow:auto;background:none;">';
  
  var aryDB=DB_LANDMARKS;
  aryDB.sort(sortByMultipleKey(['lmname']));

  for(var i=0;i<aryDB.length;i++){
    if(aryDB[i]['groupno']!= CURR_GROUP) { continue; }
    var ttrano=aryDB[i]['id'];
    var vlat=parseFloat(aryDB[i]['lat']);
    var vlng=parseFloat(aryDB[i]['lng']);
    dtl=dtl+
      '<div id="lm_line'+ttrano+'" data-clor="'+bclor+'" data-sel=0 data-row='+i+' onmouseover="subHover(this.id,1,&quot;'+ttrano+'&quot;,&quot;red&quot;)" onmouseout="subHover(this.id,0,&quot;'+ttrano+'&quot;,&quot;none&quot;)"'+
          ' style="width:100%;height:25px;font-size:14px;background-color:'+bclor+';margin-top:0px;border:0px solid gray;">'+

        '<div onclick="gotoLandmark(&quot;'+ttrano+'&quot;,'+vlat+','+vlng+')" style="float:left;width:80%;height:100%;padding:0px;text-align:center;border:0px solid gray;background:none;">'+
           '<span style="float:left;width:15%;height:100%;font-size:12px;padding:5px;border:1px solid gray;">'+(i+1)+'</span>'+
           '<input id="inp_'+ttrano+'" data-val="'+aryDB[i]['lmname']+'" type="text" style="float:left;width:85%;height:100%;padding:5px;margin-right:0px;border:1px solid gray;background:none;" disabled value="'+DB_LANDMARKS[i]['lmname']+'" />'+ 
        '</div>'+      
        
        '<div style="float:left;width:20%;height:100%;padding:0px;margin-right:0px;border:1px solid gray;background:none;">'+
           '<img id="cm_del'+ttrano+'" src="gfx/jdele.png" onclick="lm_del('+ttrano+')" style="float:right;width:25px;height:100%;cursor:pointer;" />'+
           '<img id="cm_edit'+ttrano+'" src="gfx/jedit.png" onclick="edit_landmark('+ttrano+')" style="float:right;margin-right:5px;width:25px;height:100%;cursor:pointer;" />'+
        '</div>'+
      '</div>';
    
    if(f_white==0) {				
      bclor="lightgray";
      f_white=1;
    }	else {
      bclor="white";
      f_white=0;
    }		      
  }

  dtl+='</div>';

  var dtl2=
    '<div style="width:100%;height:100%;">'+
      '<div style="width:100%;height:100%;padding:15px 0 0 0;text-align:center;background:none;">'+
        'Select a Landmark'+
      '</div>'+
    '</div>';  
  JBE_OPENBOX('myLandmark','Landmarks',dtl,dtl2);  
}

function edit_landmark(r){  
  var vv=document.getElementById('inp_'+r);  
  var ve=document.getElementById('cm_edit'+r);
  var vimg=ve.src.substr(ve.src.lastIndexOf('/')+1);

  if(vimg=='jedit.png'){
   // var x=document.querySelectorAll('[id^=lm_line]').length;
    lm_mode(1,r);
    
    document.getElementById('cm_edit'+r).src='gfx/jsave.png';
    document.getElementById('cm_del'+r).src='gfx/jcancel.png';
    vv.disabled=false;
    vv.focus();
  }else if(vimg=='jsave.png'){
    lm_mode(0,r);
    axios.post(JBE_API+'z_landmark.php', {  request: 3, 
      id: r,
      lm_name: vv.value
    }) 
    .then(function (response) {
      console.log(response.data);    
      //closeLandmark();
      get_db_landmarks(CURR_GROUP);      
      document.getElementById('cm_edit'+r).src='gfx/jedit.png';
      document.getElementById('cm_del'+r).src='gfx/jdele.png';
      vv.disabled=true;
    })
    .catch(function (error) { console.log(error); showProgress(false); });    
  }
}

function lm_mode(mod,r){
	var vdisp='auto';
	if(mod==1) {
		vdisp='none';
	}
	document.querySelectorAll('[id^=lm_line]').forEach(function(el) {    
      el.style.pointerEvents=vdisp;      
    });
    document.getElementById('lm_line'+r).style.pointerEvents='auto';
    document.getElementById('myLandmark').setAttribute('data-mode',mod);
}

function lm_del(r){
  var vv=document.getElementById('inp_'+r);  
  var o_value=document.getElementById('inp_'+r).getAttribute('data-val');
  
  var ve=document.getElementById('cm_del'+r);
  var vimg=ve.src.substr(ve.src.lastIndexOf('/')+1);
  
  if(vimg=='jcancel.png'){
    document.getElementById('cm_edit'+r).src='gfx/jedit.png';
    document.getElementById('cm_del'+r).src='gfx/jdele.png';    
    vv.disabled=true;
    vv.value=o_value;
    lm_mode(0,r);
  }else if(vimg=='jdele.png'){
    MSG_SHOW(vbYesNo,"CONFIRM:","Delete Landmark: "+o_value+"?",function(){del_landmark(r)},function(){});
  }
}
function del_landmark(r){  
  axios.post(JBE_API+'z_landmark.php', {  request: 4, 
    id: r
  }) 
  .then(function (response) {
    console.log(response.data);    
    closeLandmark();
    get_db_landmarks(CURR_GROUP);
  })
  .catch(function (error) { console.log(error); showProgress(false); });
}

function closeLandmark(){
  //document.getElementById("myLandmark").style.height = "0px";       
  //document.getElementById("myLandmark").setAttribute('data-open','0');  
  map.removeLayer(searchMarker); 
  JBE_CLOSEBOX();
}

function createLandmark(m) {        
  if(CURR_USER==null) { plsLogin(); return; }
  if(F_LIVE) { sorry(); return; }
  /*
  document.getElementById("div_tag").innerHTML='ADD';
  document.getElementById("myLandmark").style.height = "130px";       
  document.getElementById("myLandmark").style.width = "325px";       
  document.getElementById("myLandmark").setAttribute('data-open',1); 
*/
  var dtl='<div id="cmyLandmark" style="width:100%;height:'+(100)+'px;overflow:auto;background:none;">';
  var tilt=m.toUpperCase();
  var lat=document.getElementById('coorPanel_lat').innerText;
  var lng=document.getElementById('coorPanel_lng').innerText;    
  var fclor='black';  
  if(m=='search'){
    fclor='red';  
    lat='';
    lng='';
  }
  var bclor='white';  
  var f_white=0;    
    dtl+=
    '<div id="geoloc_main" style="width:100%;height:auto;padding:1px;font-size:12px;background:none;">'+      
      '<div id="geoloc" style="width:100%;height:auto;margin-left:0%;font-size:12px;background:none;">'+      
        '<div style="width:100%;height:22px;padding:1px;background:none;">'+
            '<div style="float:left;width:25px;height:auto;margin-top:3px;background:none;">LAT:</div>'+        
            '<input id="txLat1"  placeholder="D" onchange="setCOOR(1,1)" type="number" class="geo" />'+
            '<input id="txLat2"  placeholder="M" onchange="setCOOR(1,2)" type="number" class="geo" />'+
            '<input id="txLat3"  placeholder="S" onchange="setCOOR(1,3)" type="number" style="width:60px;" class="geo" />'+                    
            '<select id="txLatD" onchange="setSigned(1,this.value)" class="geo" style="width:35px;">'+
              '<option value="N" selected>N</option>'+                        
              '<option value="E">E</option>'+
              '<option value="W">W</option>'+                        
              '<option value="S">S</option>'+
            '</select>'+
            '<input id="txLat"  type="number" onchange="convert2DMS(1,this.value)" class="geo" value="'+lat+'" style="float:right;margin-right:0px;width:95px;color:blue;"/>'+          
        '</div>'+    
        '<div style="width:100%;height:22px;padding:1px;background:none;">'+
            '<div style="float:left;width:25px;height:auto;margin-top:3px;background:none;">LNG:</div>'+        
            '<input id="txLng1"  placeholder="D" onchange="setCOOR(2,1)" type="number" class="geo" />'+
            '<input id="txLng2"  placeholder="M" onchange="setCOOR(2,2)" type="number" class="geo" />'+          
            '<input id="txLng3"  placeholder="S" onchange="setCOOR(2,3)" type="number" style="width:60px;" class="geo" />'+                    
            '<select id="txLngD" onchange="setSigned(2,this.value)" class="geo" style="width:35px;">'+
              '<option value="N" selected>N</option>'+                        
              '<option value="E">E</option>'+
              '<option value="W">W</option>'+                        
              '<option value="S">S</option>'+
            '</select>'+
            '<input id="txLng"  type="number" onchange="convert2DMS(2,this.value)" class="geo" value="'+lng+'" style="float:right;margin-right:0px;width:95px;color:blue;"/>'+
        '</div>'+
      '</div>'+
      
      '<div id="div_lmName" style="float:left;width:200px;height:30px;font-size:12px;color:black;padding:1px;background:none;margin-top:10px;border:1px solid lightgray;">'+
        '<div style="float:left;height:100%;width:25%;padding:5px;background:none;">Name :</div>'+
        '<input id="lmName" type="text" value="" style="float:left;height:100%;width:75%;color:blue;" />'+
      '</div>'+    
      '<div style="float:right;width:96px;height:30px;margin-top:10px;background:violet;">'+
        '<input id="btnCmd" type="button" value="ADD" onclick="doLandmark(&quot;'+m+'&quot;,'+parseFloat(lat)+','+parseFloat(lng)+')" style="font-size:12px;color:red;float:left;margin-top:0px;height:100%;width:100%;" />'+
      '</div>'+    
    '</div>';

  dtl+='</div>';

  var dtl2=
    '<div style="width:100%;height:100%;">'+
      '<div style="width:100%;height:100%;padding:15px 0 0 0;text-align:center;background:none;">'+
        tilt+' a Landmark'+
      '</div>'+
    '</div>';  

  JBE_OPENBOX('cmyLandmark',tilt+' Landmarks',dtl,dtl2);  

  if(m=='search'){    
    document.getElementById("div_lmName").style.display='none';
    document.getElementById("txLat").disabled=false;
    document.getElementById("txLng").disabled=false;
    //document.getElementById("txLat").focus();
  }else if(m=='add'){        
    document.getElementById("txLat").disabled=true;
    document.getElementById("txLng").disabled=true;
    //document.getElementById('geoloc').style.display='none';
    document.getElementById("div_lmName").style.display='block';  
    convert2DMS(1,lat);
    convert2DMS(2,lng);  
    //document.getElementById("lmName").focus();
  }
  document.getElementById("btnCmd").value=tilt;
}

function convert2DMS(m,coor){  
  var div='txLat';
  var sel='txLatD';
  if(m==2){
    div='txLng'; 
    sel='txLngD';
  }
  coord=parseFloat(coor);
  document.getElementById(sel).value='N';   
  //alert(Math.abs(coord));
  if(coord < 0){
    coord=Math.abs(coord); 
    document.getElementById(sel).value='S';   
  }
  
  var ddd=document.getElementById(div+'1');
  var mmm=document.getElementById(div+'2');
  var sss=document.getElementById(div+'3');

  var xx=coord;
  var dd=parseInt(xx);
  var mm=xx-dd;      
      var m1=mm*60;  
      mm=parseInt(mm*60);  
  var ss=((m1-mm)*60).toFixed(5);

  ddd.value=dd;
  mmm.value=mm;
  sss.value=ss;  
}
function setSigned(m,v){
  var vdoc=document.getElementById('txLat');
  if(m==2){
    vdoc=document.getElementById('txLng');
  }
  var vval=Math.abs(vdoc.value);
  if(v=='E' || v=='N'){
    vval=vval * 1;
  }else{
    vval=vval * -1;
  }

  vdoc.value=vval;
}

function doLandmark(m,lat,lng){
  if(m=='search'){
    if(txLat.value=='' || txLng.value==''){
      snackBar('Enter Latitude & Longitude');
      return;
    }

    gotoLandmark(m,txLat.value,txLng.value);    
    return;
  }
  
  var lmName=document.getElementById("lmName").value;
  if(lmName==''){
      snackBar('Enter Landmark Name.');
      return;
  }
  JBE_CLOSEBOX();
  DB_LANDMARKS=[];
  axios.post(JBE_API+'z_landmark.php', { request: 2,       
    groupno: CURR_GROUP, 
    lmName:lmName,
    lat:lat,
    lng:lng
  }) 
  .then(function (response) { console.log(response.data); get_db_landmarks(CURR_GROUP); })
  .catch(function (error) { console.log(error); }); 
  closeLandmark();
}

function gotoMember(m,lat,lng){
  JBE_CLOSEBOX();
  document.getElementById('coorPanel_lat').innerText=lat;
  document.getElementById('coorPanel_lng').innerText=lng;
  map.setView([lat, lng], 16);
}

function showLandmarks(){       
  //alert('DB_MEMBERS.length = '+DB_MEMBERS.length);
  console.log('DB_LANDMARKS.length = '+DB_LANDMARKS.length);
  var markers=DB_LANDMARKS;
  landmarkClusters.clearLayers(); 
  //markerClusters.clearLayers(); 
 
  for ( var i = 0; i < markers.length; i++) {
    var d = new Date();
    var n = d.getTime();

    var vname=markers[i]['lmname'];    
    var sname=markers[i]['lmname'].substr(0,3).toUpperCase();
    var vlat= parseFloat(markers[i]['lat']);
    var vlng=parseFloat(markers[i]['lng']);    
    
    var vgroupname=JBE_GETFLD('grpname',DB_GROUP,'groupno',markers[i]['groupno']);
        
    var poptxt ='<div style="width:250px;height:auto;margin-top:20px;z-index:500;">' +
                  '<div style="width:100%;height:35px;padding:2px;text-align:center;color:white;background-color:green;">'+vname+'</div>' +                  
                  '<br/><b>Latitude:</b> ' + vlat + 
                  '<br/><b>Longitude:</b> ' + vlng +                   
                  '<hr>'+
                  '<div style="width:100%;height:35px;padding:5px;text-align:center;border:0px solid gray;color:white;background-color:green;">LANDMARK'+                  
                  '</div>'+
                '</div>';      
    
    var m = L.marker( [vlat, vlng], {icon: L.divIcon({ className: 'landmark_custom_icon',iconAnchor: [21,41],html: sname })    
                   }).bindPopup( poptxt ).on('click', L.bind(xseleRecord,null,markers[i]['usercode']));

    landmarkClusters.addLayer(m);
  }

  map.addLayer( landmarkClusters );
}
function gotoLandmark(m,lat,lng){  
  if(m=='add'){
    var vmode=document.getElementById('myLandmark').getAttribute('data-mode');
    alert('go2 : '+vmode);
    if(vmode!=0) { return; }
  }
  
  JBE_CLOSEBOX();
  map.removeLayer(searchMarker);
  document.getElementById('coorPanel_lat').innerText=lat;
  document.getElementById('coorPanel_lng').innerText=lng;
  if(m=='search'){
    searchMarker = L.marker([lat,lng], {icon: searchIcon}).addTo(map);   
    //document.getElementById("btnSV").style.display='block';   
  }
  map.setView([lat, lng], 20);
}

function searchLatLong(lat,lng){
  createLandmark('search');
}

function setCOOR(coor,col){  
  var div='txLat';
  if(coor==2){
    div='txLng';
  }
  
  //DD = d + (min/60) + (sec/3600)  
  var d=parseFloat(document.getElementById(div+'1').value);
  var m=parseFloat(document.getElementById(div+'2').value);
  var s=parseFloat(document.getElementById(div+'3').value);
  
  //var m=parseFloat($(div+'2').val());
  var m=parseFloat(document.getElementById(div+'2').value);
  var s=parseFloat(document.getElementById(div+'3').value);  
  
  if(isNaN(parseFloat(document.getElementById(div+col).value))){                
    //$(div+col).val(0);
    document.getElementById(div+col).value=0;

    //$(div+col).focus();
    document.getElementById(div+col).focus();

    //$(div).val(0);
    document.getElementById(div).value=0;
    return    
  }
  var DD = parseFloat(d + (m/60) + (s/3600)).toFixed(5);
  if(isNaN(DD)){
    DD=0;
  }
  //alert('change: '+DD);
  //$(div).val(DD);
  document.getElementById(div).value=DD;
}

function openBox(div,title,dtl) {   
  
  //document.getElementById("myBox").style.height=0+'px';
  //document.getElementById("myBox").style.bottom=50+'px';  
  //document.getElementById("myBox_main").style.bottom = 0+'px';     
  
  //document.getElementById("myBox_main").style.height = hh+'px';         
  //document.getElementById("myBox_main").setAttribute('data-open',1);     
  
  var x=document.getElementById("myBox_main").getAttribute('data-open'); 
  if(x==1) { 
    //closeBox();
    //return;
  } 
  document.getElementById("myBox").style.height = H_BODY+'px';       
  document.getElementById("cap_box").innerHTML=title;
  document.getElementById("dtl_box").innerHTML=dtl;
  
  var h=parseInt(document.getElementById(div).style.height);
  
  var hh=h+30+12; //dtl height + box head height + paddings
         
  document.getElementById("dtl_box").style.height = (h+12)+'px';         
  
  document.getElementById("myBox_main").style.height = hh+'px';         
  document.getElementById("myBox_main").setAttribute('data-open',1);     
}