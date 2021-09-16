var tbs;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
if(message == "tab"){
chrome.tabs.getSelected(null, function(tab){tbs  = tab}); 
} 
if(message == "ban"){
  chrome.tabs.sendMessage(tbs.id,"ban");
}
if(message.includes('["') == true){
  login_cookie(JSON.parse(message))
}
if (message == "capcha") {
    chrome.tabs.sendMessage(tbs.id, "capcha");
}
});

chrome.tabs.onRemoved.addListener(function(tabId, info) {
        chrome.tabs.sendMessage(tbs.id,"chk");
});


function login_cookie(acc) {
  for (var i = 1; i < acc.length; i++) {
 var parts = acc[i].split('=', 2);
chrome.cookies.set({ url: "https://www.instagram.com/", name: parts[0] , value: parts[1], domain:".instagram.com", secure:true, httpOnly:true, expirationDate:1684860821})
  }
}




