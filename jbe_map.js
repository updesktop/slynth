function onLocationFound(e) {
  // if position defined, then remove the existing position marker and accuracy circle from the map    
  if (current_position) {
      map.removeLayer(current_position);
      map.removeLayer(current_accuracy);
  }
  
  //var coord = e.latlng;
  console.log(e);
  document.getElementById('coorPanel_lat').innerText=e.latlng.lat;
  document.getElementById('coorPanel_lng').innerText=e.latlng.lng;    

  var radius = e.accuracy / 2;
  if(!F_LIVE){
    radius=0;
  }

  current_position = L.marker(e.latlng, {icon: L.divIcon({ className: 'user_custom_icon',iconAnchor: [21,41],html: CURR_TAG})}).addTo(map);
  current_accuracy = L.circle(e.latlng, radius).addTo(map);
  if(CURR_USER) {
    saveUserPosition(e.latlng.lat,e.latlng.lng);
  }
}
function onLocationError(e) {
  //MSG_SHOW(vbOk,"ERROR:",e.message,function(){},function(){});
  snackBar("ERROR:<br>"+e.message);
}

function jlocate(f) {
  map.locate({
    setView: true,     
    watch:f
  });    
}

//map.on('zoomend', changeLocateMaxZoom);

function changeLocateMaxZoom(e) {
  alert(9);
  if (map.locateOptions) {
      map.locateOptions.maxZoom = map.getZoom();
  }
}

function saveUserPosition(lat,lng){
  // record your current position  
  axios.post(JBE_API+'z_user.php', {  request: 10, 
    usercode: CURR_USER, 
    lat:lat,
    lng:lng
  }) 
  .then(function (response) {
    console.log(response.data);
    JBE_USER=response.data;
    console.log('LOCATION CHANGED');
  })
  .catch(function (error) { console.log(error); });
}

function goLive(){  
  if(!CURR_USER){
    plsLogin();
    return;
  }
  if(!F_LIVE){
    F_LIVE=true;
    //closeGroup();    
    //closeLandmark();        
    jlocate(F_LIVE);
    document.getElementById('btnLive').style.borderColor='red';
  }else{
    F_LIVE=false;
    clearInterval(LOC_MEMBERS);
    map.stopLocate();
    
    jlocate(false);
    document.getElementById('btnLive').style.borderColor='black';    
  }   
}
function refreshMembers(){  
  get_db_members(CURR_GROUP);
}

function showMembers(){       
  //alert('yawa DB_MEMBERS.length = '+DB_MEMBERS.length);  
  var markers=DB_MEMBERS;
  memberClusters.clearLayers(); 
 
  for ( var i = 0; i < markers.length; i++) {
    if(markers[i]['usercode']==CURR_USER){ continue; }
    var d = new Date();
    var n = d.getTime();

    var vname=markers[i]['username'];
    var vtag=markers[i]['tag'];
    var vcelno=markers[i]['celno'];
    var vlat= parseFloat(markers[i]['lat']);
    var vlng=parseFloat(markers[i]['lng']);    
    
    var vgroupname=JBE_GETFLD('grpname',DB_GROUP,'groupno',markers[i]["groupno"]);
        
    var poptxt ='<div style="width:250px;height:auto;margin-top:20px;z-index:500;">' +
                  '<div style="width:100%;height:35px;padding:2px;text-align:center;color:white;background-color:#2e75b6;">'+vname+'</div>' +
                  '<hr><b>Group:</b> ' + vgroupname + 
                  '<br/><hr><b>Celfone:</b> ' + vcelno + 
                  '<br/><b>Latitude:</b> ' + vlat + 
                  '<br/><b>Longitude:</b> ' + vlng +                   
                  '<hr>'+
                  '<div style="width:100%;height:35px;padding:5px;text-align:center;border:0px solid gray;background-color:#2e75b6;">'+
                  '   <img src="gfx/jcall.png" onclick="callText(&quot;call&quot;,&quot;'+vcelno+'&quot;)" style="float:left;margin-left:4%;height:100%;"/>' +
                  '   <img src="gfx/jsms.png"  onclick="callText(&quot;txt&quot; ,&quot;'+vcelno+'&quot;)" style="float:right;margin-right:4%;height:100%;"/>' +
                  '</div>'+
                '</div>';      
    
    var m = L.marker( [vlat, vlng], {icon: L.divIcon({ className: 'member_custom_icon',iconAnchor: [21,41],html: vtag})    
                   }).bindPopup( poptxt ).on('click', L.bind(xseleRecord,null,markers[i]['usercode']));

                   memberClusters.addLayer(m);    
  }
  
  map.addLayer(memberClusters);
}


/******************* FUNCTIONS ****************************************************************** */


function seleRecord(projid) {    
  location.hash='#proj_line'+projid;
  setRecord(projid);
  history.pushState("", document.title, window.location.pathname);
}
function xseleRecord(projid) {    
  
}