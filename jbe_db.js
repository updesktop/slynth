var dbVersion = 1;
var dbReady = false;
var db;

if (navigator.storage && navigator.storage.persist)
  navigator.storage.persist().then(granted => {
    if (granted){
      //alert("Storage will not be cleared except by explicit user action");
      PERSIST_GRANTED=true;
    }else{
      //alert("Storage may be cleared by the UA under storage pressure.");
      PERSIST_GRANTED=false;
    }
  }
);



function initDb() {
  console.log('initDb activated...'+JBE_ONLINE);
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }

  request.onsuccess = function(e) {
    db = e.target.result;
    console.log('db opened');  
  }

  request.onupgradeneeded = function(e) {
    db = e.target.result;     
    db.createObjectStore('SysFile', { keyPath:'id' });
    db.createObjectStore('User', { keyPath:'id' });    
    dbReady = true;
  }
}

function clearStore(jstore){  
  var trans = db.transaction([jstore], 'readwrite');
  var req = trans.objectStore(jstore).clear();

  req.onerror = function(e) {
    console.log('error clearing storeobject');
    console.error(e);
  }

  req.onsuccess = function(e) {
    console.log('objectStore Cleared');
  }
}


/****************************************/
function countRecordIDX(n){  
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }
  request.onsuccess = function(e) {
    var db1 = e.target.result;
    var flename=JBE_STORE_IDX[n]['flename'];    
    var jstore = db1.transaction([flename]).objectStore(flename); 
    var count = jstore.count();
    count.onsuccess = function() {      
      JBE_STORE_IDX[n]['numrec']=count.result;
      console.log('countRecordIDX: '+JBE_STORE_IDX[n]['flename']+' '+count.result);
    }
  }
}

/****************************************/
function getAllDataFromIDX(vmode) {   
  var request = indexedDB.open(CURR_IDX_DB, dbVersion);  
  request.onerror = function(e) {    
    console.error('Unable to open database.');
  }

  var ctr=0;
  request.onsuccess = function(e) {
    var db2 = e.target.result;
    for(var i=0;i<JBE_STORE_IDX.length;i++){
      //if(!vmode && JBE_STORE_IDX[i]['init'] == 0) { continue; }
      //if(parseInt(JBE_STORE_IDX[i]['init']) != vmode) { continue; }
      //alert(JBE_STORE_IDX[i]['flename']+' = '+JBE_STORE_IDX[i]['init']);
      getDataFromIDX(i,db2);  
      ctr++;
    }
  }
  //alert('total: '+ctr);
}  

function getDataFromIDX(i,db2) {  
  var idx=0;
  var aryIDB=[]; 
  var flename=JBE_STORE_IDX[i]['flename'];
      
  var trans = db2.transaction([flename]);
  var object_store = trans.objectStore(flename);
  var request1 = object_store.openCursor();

  request1.onerror = function(event) {
    console.err("error fetching data");
  };
  
  request1.onsuccess = function(event) {        
    var cursor = event.target.result;    
    if (cursor) {
      var key = cursor.primaryKey;
      var ob;
      if(i==0){ //Category
        ob = {
          id:idx,
          catno:cursor.value.catno,
          descrp:cursor.value.descrp,
          photo:cursor.value.photo, 
          orient:cursor.value.orient,              
          bal:cursor.value.bal
        };  
      }else if(i==1){ //Stock
        ob = {
          id:idx,
          stockno:cursor.value.stockno,
          descrp:cursor.value.descrp,
          photo:cursor.value.photo, 
          orient:cursor.value.orient,
          catno:cursor.value.catno,
          cost:cursor.value.cost,
          price:cursor.value.price,
          bal:cursor.value.bal,
          promo:cursor.value.promo
        };        
      }else if(i==2){ //Sysfile
        ob = {
          id:i,
          banner:cursor.value.banner,
          hd1:cursor.value.hd1,
          hd2:cursor.value.hd2,
          hd3:cursor.value.hd3,
          pg_title:cursor.value.pg_title,
          pg_body:cursor.value.pg_body,
          clor1:cursor.value.clor1,
          clor2:cursor.value.clor2, 
          clor3:cursor.value.clor3,
          clor4:cursor.value.clor4,
          txclor1:cursor.value.txclor1,
          txclor2:cursor.value.txclor2, 
          txclor3:cursor.value.txclor3,
          txclor4:cursor.value.txclor4
        };  
      }else if(i==3){ //User
        ob = {
          id:i,
          usercode:cursor.value.usercode,
          username:cursor.value.username,            
          photo:cursor.value.photo
        };        
      }

      aryIDB[idx]=ob;                
      idx++;
      cursor.continue();
    }else{
      if(i==0){
        DB_CAT=[]; DB_CAT=aryIDB;                  
        showCategories();           
      }else if(i==1){
        DB_STOCK=[]; DB_STOCK=aryIDB;         
        showItems();        
        showPromos();           
      }else if(i==2){          
        DB_SYS=[]; DB_SYS=aryIDB;
        showSystem();
      }else if(i==3){          
        DB_USER=[]; DB_USER=aryIDB;
        showProfile(2);      
      }
      JBE_STORE_IDX[i]['numrec']=aryIDB.length;
    }    
  }
}  


function saveDataToIDX(aryDB,n) {    
  //alert(n);
  //alert('Saving File '+JBE_STORE_IDX[n]['flename']+' == '+aryDB.length);
  JBE_STORE_IDX[n]['numrec']=aryDB.length;
  for(var i=0;i<aryDB.length;i++){    
    putDataToIDX(i,aryDB,n);
  }
}
function putDataToIDX(i,aryDB,n){        
  if(n==2){
    var jimg='gfx/'+aryDB[i]['banner'];
    //alert('putDataToIDX '+jimg);
  }else if(n==3){
    var jimg='upload/users/'+aryDB[i]['photo'];
  }else{
    var jimg='upload/'+aryDB[i]['photo'];
  }  
  
  var canvas = document.createElement("canvas");
  const context = canvas.getContext('2d');
  var img = new Image();
  img.src=jimg;
  
  img.onload = function() {
    canvas.width=img.width;
    canvas.height=img.height;
    context.drawImage(img, 0, 0);
    
    canvas.toBlob(function (blob) {        // get content as JPEG blob      
      var reader = new FileReader();
      reader.readAsBinaryString(blob);
      reader.onload = function(e) {    
        var bits = e.target.result;
        var ob;     

        if(n==0){
          ob = { //categorgy
            id:i,
            catno:aryDB[i]['catno'],
            descrp:aryDB[i]['descrp'],
            photo:bits,
            orient:aryDB[i]['orient'],
            bal:aryDB[i]['bal'],            
          };
        }else if(n==1){ //stock
          ob = {
            id:i,
            stockno:aryDB[i]['stockno'],
            descrp:aryDB[i]['descrp'],
            photo:bits,
            orient:aryDB[i]['orient'],
            catno:aryDB[i]['catno'],
            cost:aryDB[i]['cost'],
            price:aryDB[i]['price'],
            bal:aryDB[i]['bal'],
            promo:aryDB[i]['promo']
          };        
        }else if(n==2){ //sysfile
          ob = {
            id:i,
            banner:bits,
            hd1:aryDB[i]['hd1'],
            hd2:aryDB[i]['hd2'],
            hd3:aryDB[i]['hd3'],              
            pg_title:aryDB[i]['pg_title'],
            pg_body:aryDB[i]['pg_body'],
            clor1:aryDB[i]['clor1'],
            clor2:aryDB[i]['clor2'],
            clor3:aryDB[i]['clor3'],
            clor4:aryDB[i]['clor4'],
            txclor1:aryDB[i]['txclor1'],
            txclor2:aryDB[i]['txclor2'],
            txclor3:aryDB[i]['txclor3'],
            txclor4:aryDB[i]['txclor4']
          };  
        }else if(n==3){ //user
          ob = {
            id:i,
            usercode:aryDB[i]['usercode'],
            username:aryDB[i]['username'],            
            photo:bits
          };
        }

        var trans = db.transaction([JBE_STORE_IDX[n]['flename']], 'readwrite');
        var addReq = trans.objectStore(JBE_STORE_IDX[n]['flename']).put(ob);
        addReq.onerror = function(e) {
          //console.log('error storing data');
          console.log('ERROR: putToIDX '+JBE_STORE_IDX[n]['flename']);
          console.error(e);
        }

        trans.oncomplete = function(e) {
          console.log('putToIDX '+JBE_STORE_IDX[n]['flename']);  
        }
      }
      
    }); 
  }  
}

function refreshIDX(){    
  //alert('refreshIDX '+DB_SYS.length+' = '+DB_SYS[0]['client']);
  if(JBE_STORE_IDX[0]['numrec'] != DB_CAT.length){ clearStore(JBE_STORE_IDX[0]['flename']); saveDataToIDX(DB_CAT,0); }
  if(JBE_STORE_IDX[1]['numrec'] != DB_STOCK.length){ clearStore(JBE_STORE_IDX[1]['flename']); saveDataToIDX(DB_STOCK,1); }  
  if(JBE_STORE_IDX[2]['numrec'] != DB_SYS.length){ clearStore(JBE_STORE_IDX[2]['flename']); saveDataToIDX(DB_SYS,2); }
  if(JBE_STORE_IDX[3]['numrec'] != DB_USER.length){ clearStore(JBE_STORE_IDX[3]['flename']); saveDataToIDX(DB_USER,3); }         
  //jdata();  
}

function jdata(){
  var jd=
    'From IDX '+JBE_STORE_IDX[0]['flename']+' : '+JBE_STORE_IDX[0]['numrec']+' vs '+DB_CAT.length+' Array<br>'+
    'From IDX '+JBE_STORE_IDX[1]['flename']+' : '+JBE_STORE_IDX[1]['numrec']+' vs '+DB_STOCK.length+' Array<br>'+
    'From IDX '+JBE_STORE_IDX[2]['flename']+' : '+JBE_STORE_IDX[2]['numrec']+' vs '+DB_SYS.length+' Array<br>'+
    'From Array CLIENTS '+DB_CLIENTS.length+' Array<br>'+
    'From Array BELLS '+DB_BELL.length+' Array<br>'+
    'From IDX '+JBE_STORE_IDX[3]['flename']+' : '+JBE_STORE_IDX[3]['numrec']+' vs '+DB_USER.length+' Array';

  MSG_SHOW(vbOk,"DATA:",jd,function(){},function(){}); 
}