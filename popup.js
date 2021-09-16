var lenLikes = 6;
var lenFollows = 5;
var taskNum= 0;
var taskType = 1;
var checkCapcha = 0;
var onError = 0;
var taskBlocker = false;
var taskBlockerText;

if(localStorage.getItem("logs") == null){localStorage.setItem("logs" ,"")}
function InstaAccauntChanger(account) {chrome.runtime.sendMessage(account)}
if(window.location.href.includes("https://wiq.ru/tasks/api.php?") == true){
  if(document.getElementsByClassName("g-recaptcha")[0] != null){
  chrome.runtime.sendMessage('capcha');
  capcha = 1;
  }else{
    setTimeout(function(){close()},2300)
  }
}

if(location.href == "https://wiq.ru/tasks.php"){
chrome.runtime.sendMessage('tab');
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
 if(msg == "chk"){scrollBy(0, 100);taskCheck()}
 if (msg == "capcha") {send("бот ожидает запуска");checkCapcha = 1;}
});
 firstTask();
}


function firstTask() {
  setTimeout(function(){taskStart()}, 4002)
}


function taskStart() {
var lenTasks;
var tasks = document.getElementsByClassName("task_start");
var str = document.getElementsByClassName("col-md-9")[taskNum].innerText;
        if (str.includes("Twitter") == false) {
            if(taskBlocker == false){
       tasks[taskNum].click()
   }else{
    send(taskBlockerText)
    }   
        }else{
            taskNum++;
            taskStart()
        }
}




function taskCheck(argument) {
    var taskCheker = document.getElementsByClassName("task_check")[taskNum].click();    
    taskNum++;
    listenerClass();
    onError = 0;
}

function listenerClass() {
    setTimeout(function(){
        if(taskType == 1){lenTasks = lenFollows}else{lenTasks = lenLikes}
        var tasks =document.getElementsByClassName("task_start")[taskNum];
        var taskLength = tasks.length -1;
if(taskNum < taskLength || taskNum < lenTasks){
       if(tasks.className.includes("disabled") == false){
          taskStart()
       }else{
        onError++;
        if(onError < 19){
        listenerClass()
    }else{
taskTypeChanger()
    }
       }
}else{
    taskTypeChanger()
}

    },800)
}


function taskTypeChanger() {
    taskNum = 0;
    if (taskType == 1) {
document.getElementById("refresh3").click()
        taskType = 2;
    }else{
        document.getElementById("refresh1").click()
        taskType = 1;
    }
    firstTask();
}


//CODE FOR INSTAGRAM
 
if(location.href.includes("instagram.com/challenge") == true){
  chrome.runtime.sendMessage('ban')
}

if(window.location.host == "www.instagram.com"){
setTimeout(function(){
  var currentURL =location.href;
  setTimeout(function(){
       if(document.getElementsByClassName("_7UhW9     LjQVu     qyrsm KV-D4    uL8Hv")[0] != null){
      chrome.runtime.sendMessage('ban')
    }
    close()
    },1500);
   if(currentURL.includes("/p/") == true||currentURL.includes("/reel/") == true){
   document.getElementsByClassName("wpO6b")[1].click();
      }else{
    if(document.getElementsByClassName("_5f5mN")[0] == null){
     document.getElementsByClassName("sqdOP")[0].click()
    }else{
      document.getElementsByClassName("_5f5mN")[0].click()
    }
}
},1900);
}





//FOR TELEGRAM BOT

if (location.href == "https://wiq.ru/tasks.php") {
     function time() {send("get")}
var myVar = setInterval(time, 5000);
    function send(mess) {
  if (mess == "get") {
    geturl = 'https://api.telegram.org/bot1955241209:AAGMStaoPpYZZFF_ha_0853RdvESEvlAa14/getUpdates';
  }else{
    geturl = 'https://api.telegram.org/bot1955241209:AAGMStaoPpYZZFF_ha_0853RdvESEvlAa14/sendMessage?chat_id=1329000291&text='+mess;
  }
function callback() {
    if (xhr.readyState === XMLHttpRequest.DONE){
        if (xhr.status === 200){
            result = xhr.responseText;
             if (mess == "get"){
var obj = JSON.parse(result);
var last  = obj.result[Object.keys(obj.result).length-1].message.date;
var chatm = obj.result[Object.keys(obj.result).length-1].message.text;
 if (localStorage.getItem("last") == null) {localStorage.setItem("last", "")}
if(localStorage.getItem("last") != last){command(chatm);localStorage.setItem("last",last);}
}}}}
var xhr = new XMLHttpRequest();
xhr.open("GET", geturl, true);
xhr.onreadystatechange = callback;
xhr.send()
}

function command(dt){
    if (dt =="/cash") {
send(document.getElementById("user_balance").innerHTML);
  }
 if(dt == "/next") {
var stg =localStorage.getItem("logs");
var parts = stg.split(']', 10000);
send(`аккаунт удален:` + parts[0]+"]");
InstaAccauntChanger(parts[1]+"]");
var nwd = localStorage.getItem("logs").replace(parts[0]+"]",''); 
localStorage.setItem('logs', nwd);
 }
  if (dt == "/stop") {
 taskBlocker = true;
 taskBlockerText = "бот остановлен";
  }
if (dt == "/info") {
   send(localStorage.getItem("logs"));
}

if (dt.includes("s/") == true) {
    var speder = parseInt(dt.replace("s/",""));
   send("speed seted: " + speder);
   speed = speder;
}
  if (dt == "/start" ) {
 location.href = "https://wiq.ru/tasks.php";
}
  if (dt.includes("csrftoken") == true) {
    var stg =localStorage.getItem("logs"); 
   if(stg.includes(dt) == false){
    localStorage.setItem('logs', stg + dt);
    if (stg == "") {
      InstaAccauntChanger(dt);
    }  
    send("account added successfully");
   }
  }

  if(dt.includes("del/") == true){
    var dlt = dt.substr(4);
    var stg =localStorage.getItem("logs").replace(dlt,'');
    localStorage.setItem("logs", stg);
    send(localStorage.getItem("logs"));
  }

}
}

