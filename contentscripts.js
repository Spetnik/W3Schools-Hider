document.addEventListener("DOMContentLoaded", function(event) {
	var flgAction = false;
	var lastMutation = "";

	var takeAction = function(){
		
		if(document.querySelector('#rso') == null || document.querySelector('#rso').getAttribute("eid") == lastMutation)
			return;

		//If querystring has a tbm=isch value then it's an image search
		if(window.location.search.replace("?","").split("&").filter(function(a){a=a.split("=");var q=a[0],v=a[1]; return q=="tbm" && v=="isch" }).length == 1)
			return;

		if(!flgAction){
		  	chrome.extension.sendMessage({action: "showPageAction"}, function(response) {});
			flgAction = true;
		}
		lastMutation = document.querySelector('#rso').getAttribute("eid");

		var maxI = 50, ii=0;

		if(document.querySelector("div#center_col") != null)
				document.querySelector("div#center_col").style.display = "none";

		chrome.extension.sendMessage({action: "getBlockedDomains"}, function(response) {
			var arDomains = response.arDomains;
			arDomains.push({match: "ends", domain: ".w3schools.com"});

			arDomains.forEach(function(domain){
				var basicList = document.querySelectorAll("div.g a[href*='" + domain.domain + "']"); //All links containing domain
				var arBasic = [];
				for(var i = 0; i < basicList.length; i++){
					arBasic.push(basicList[i]);
				}

				arBasic.forEach(function(link){
					var href = link.href.substr(link.href.search("://")+3);
					href = href.substr(0, href.search("/"));
					console.log(href);
					var flgRemove = false;
					switch(domain.match){
						case "exact":
							if(href == domain.domain)
								flgRemove = true;
							break;
						case "starts":
							if(href.search(domain.domain) == 0)
								flgRemove = true;
							break;
						case "contains":
							if(href.search(domain.domain) >= 0)
								flgRemove = true;
							break;
						case "ends":
							if(href.search(domain.domain) == href.length - domain.domain.length)
								flgRemove = true;
							break;
					}

					if(flgRemove){
						var resultItem = link.parentElement;
							
						do{
							resultItem = resultItem != null && resultItem.parentElement != null ? resultItem.parentElement : null;
						}while(resultItem != null && ii++ < maxI && resultItem.nodeName !=null && !(resultItem.nodeName.toLowerCase() == "div" && resultItem.classList.contains("g")));

						if(resultItem != null)
							resultItem.remove();
					}
				});
			});
			if(document.querySelector("div#center_col") != null)
				document.querySelector("div#center_col").style.display = "block";
		});
	};

	takeAction();

	new MutationObserver(function(mutations){
		mutations.forEach(function(mutation){
			
			if(!(mutation.target.id == "search" || mutation.target.id == "gsr"))
				return;

			takeAction();			
		});
	}).observe(document.body, {childList: true, subtree: true});

});
