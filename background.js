chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		switch(request.action){
			case "showPageAction":
				chrome.pageAction.show(sender.tab.id);
				sendResponse({});
				break;
			case "getBlockedDomains":
				try{
					sendResponse({arDomains: JSON.parse(localStorage["blockedDomains"])});
				}catch(e){
					sendResponse({arDomains: []});
				}
				break;
		}
	}
);