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
  if(CURR_USER==null){
    plsLogin();
    return;
  }
  if(!F_LIVE){
    F_LIVE=true;
    closeGroup();    
    closeLandmark();        
    jlocate(F_LIVE);
    document.getElementById('btnLive').style.backgroundColor='red';
  }else{
    F_LIVE=false;
    clearInterval(LOC_MEMBERS);
    map.stopLocate();
    
    jlocate(false);
    document.getElementById('btnLive').style.backgroundColor='navy';    
  }   
}
function refreshMembers(){  
  get_db_members(CURR_GROUP);
}

function showMembers(){       
  //alert('JBE_MEMBERS.length = '+JBE_MEMBERS.length);
  console.log('JBE_MEMBERS.length = '+JBE_MEMBERS.length);
  var markers=JBE_MEMBERS;
  markerClusters.clearLayers(); 
 
  for ( var i = 0; i < markers.length; i++) {
    
    var d = new Date();
    var n = d.getTime();

    var vname=markers[i]['username'];
    var vtag=markers[i]['tag'];
    var vcelno=markers[i]['celno'];
    var vlat= parseFloat(markers[i]['lat']);
    var vlng=parseFloat(markers[i]['lng']);    
    
    var vgroupname=JBE_GETFLD('grpname',JBE_GROUP,'groupno',markers[i]["groupno"]);
        
    var poptxt ='<div style="width:250px;height:auto;margin-top:20px;z-index:9006;">' +
                  '<div style="width:100%;height:35px;padding:2px;text-align:center;color:white;background-color:#2e75b6;">'+vname+'</div>' +
                  '<hr><b>Group:</b> ' + vgroupname + 
                  '<br/><hr><b>Celfone:</b> ' + vcelno + 
                  '<br/><b>Latitude:</b> ' + vlat + 
                  '<br/><b>Longitude:</b> ' + vlng +                   
                  '<hr>'+
                  '<div style="width:100%;height:35px;padding:5px;text-align:center;border:0px solid gray;background-color:#2e75b6;">'+
                  '   <img src="gfx/call.png" onclick="callText(&quot;call&quot;,&quot;'+vcelno+'&quot;)" style="float:left;margin-left:4%;height:100%;"/>' +
                  '   <img src="gfx/sms.png"  onclick="callText(&quot;txt&quot; ,&quot;'+vcelno+'&quot;)" style="float:right;margin-right:4%;height:100%;"/>' +
                  '</div>'+
                '</div>';      
    
    var m = L.marker( [vlat, vlng], {icon: L.divIcon({ className: 'member_custom_icon',iconAnchor: [21,41],html: vtag})    
                   }).bindPopup( poptxt ).on('click', L.bind(xseleRecord,null,markers[i]['usercode']));

    markerClusters.addLayer(m);    
  }
  
  map.addLayer( markerClusters );
}


/******************* FUNCTIONS ****************************************************************** */


function seleRecord(projid) {    
  location.hash='#proj_line'+projid;
  setRecord(projid);
  history.pushState("", document.title, window.location.pathname);
}
function xseleRecord(projid) {    
  
}