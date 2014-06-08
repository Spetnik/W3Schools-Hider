$(function(){
	
	var arDomains = [];

	var addURL = function(){
		var patterns = {
			exact: /[^a-zA-Z0-9\-\.]|^[\.\-]|[\.\-]$/,
			starts: /[^a-zA-Z0-9\-\.]|^[\.\-]/,
			contains: /[^a-zA-Z0-9\-\.]/,
			ends: /[^a-zA-Z0-9\-\.]|[\.\-]$/
		};
		
		var match = $('input[name=match]:checked').val();
		var domain = $('#inpAddSite').val();

		if(domain.trim().length == 0)
			return;
		
		if(domain.search(patterns[match]) > -1){
			$('#dvMessage').text("Invalid characters in domain name.");
			$('#dvMessage').show();
			$('#dvMessage').fadeOut({duration: 2400});
			return;
		}

		arDomains.push({match: match, domain: domain});
		arDomains.sort(function(a, b){
			return a.domain > b.domain ? 1 : -1;
		});

		$('#selSites').empty();

		loadDomains();
		
		$('#inpAddSite').val("");
		
		saveOptions();
	};

	var loadDomains = function(){
		$('#selSites').append($('<option>').val(".w3schools.com").data("match", "ends").text("*.w3schools.com").prop("disabled", true));
		$(arDomains).each(function(){
			var displayURL = this.domain;

			switch(this.match){
				case "starts":
					displayURL = displayURL + "*";
					break;
				case "contains":
					displayURL = "*" + displayURL + "*";
					break;
				case "ends":
					displayURL = "*" + displayURL;
					break;
			}
			$('#selSites').append($('<option>').val(this.domain).data("match", this.match).text(displayURL));
		});
	};

	var removeURL = function(){
		$('#selSites').children(":selected").each(function(){
			$option = $(this);
			arDomains = $.grep(arDomains, function(item){
				return item.match != $option.data("match") || item.domain != $option.val();
			});
		});
		$('#selSites').children(":selected").remove();
		saveOptions();
	};


	var saveOptions = function(){
		localStorage["blockedDomains"] = JSON.stringify(arDomains);
	};

	var getOptions = function(){
		if(localStorage["blockedDomains"] == null){
			loadDomains();
			return;
		}

		try{
			arDomains = JSON.parse(localStorage["blockedDomains"]);
		}catch(e){
			arDomains = [];
		}

		loadDomains();
		
	};

	//Event handlers
	$("#frmOptions").submit(function(){
		event.preventDefault();
		event.stopPropagation();
	});

	$("#btnAdd").click(addURL);
	$('#inpAddSite').keypress(function(e){
		if(e.which == 13)
			addURL();
	});
	$("#btnRemove").click(removeURL);

	getOptions();
});