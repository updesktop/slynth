  function get_db_members(g){
    DB_MEMBERS=[];
    axios.post(JBE_API+'z_user.php', { request: 1, groupno: g, x: CURR_USER }) 
    .then(function (response) { console.log(response.data); DB_MEMBERS = response.data; showMembers(); })
    .catch(function (error) { console.log(error); }); 
  }  
  function get_db_group(){
    DB_GROUP=[];
    axios.post(JBE_API+'z_group.php', { request: 1 }) 
    .then(function (response) { console.log(response.data); DB_GROUP = response.data; })
    .catch(function (error) { console.log(error); }); 
  }
  function get_db_landmarks(g){
    DB_LANDMARKS=[];
    axios.post(JBE_API+'z_landmark.php', { request: 0, groupno: g }) 
    .then(function (response) { console.log(response.data); DB_LANDMARKS = response.data; showLandmarks(); })
    .catch(function (error) { console.log(error); }); 
  }  

  function init_db(){    
    get_db_group();
    get_db_members(CURR_GROUP);    
  }

  function get_db_user(u,p){
    axios.post(JBE_API+'z_user.php', {  request: 0, usercode: u, pword: p }) 
    .then(function (response) {
      JBE_USER=response.data;
    })
    .catch(function (error) { console.log(error); showProgress(false); });     
  }

  function get_data(){    
    get_db_user(CURR_USER,CURR_PASS);    
    get_db_landmarks(CURR_GROUP);
    
    DB_GROUP=[];
    axios.post(JBE_API+'z_group.php', { request: 1 }) 
    .then(function (response) { 
      console.log(response.data); 
      DB_GROUP = response.data; 
      get_db_members(CURR_GROUP);       
    })
    .catch(function (error) { console.log(error); }); 
  }

  function get_db_tanan(){
    DB_MEMBERS=[]; DB_LANDMARKS=[]; DB_GROUP=[];
    axios.post(JBE_API+'z_tanan.php', { groupno:CURR_GROUP, request: 0 })     
    .then(function (response) { console.log(response.data); 
      DB_MEMBERS = response.data[0];  
      DB_LANDMARKS = response.data[1];  
      DB_GROUP = response.data[2];    
      /*  
      alert(
        'CURR_USER : '+CURR_USER+'\n'+
        'DB_USER : '+DB_MEMBERS.length+'\n'+
        'DB_MEMBERS : '+DB_MEMBERS.length+'\n'+
        'DB_LANDMARKS : '+DB_LANDMARKS.length+'\n'+
        'DB_GROUP : '+DB_GROUP.length
      )
      */
      showMembers();
      showLandmarks(); 
      showUser();
      //alert('get db tanan: '+DB_USER.length);
    })    
    .catch(function (error) { console.log(error); });
  }
     