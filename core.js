$(document).ready(function(){

	$(".asUP").on('input', function(evt) {
			  var input = $(this);
			  var start = input[0].selectionStart;
			  $(this).val(function (_, val) {
			    return val.toUpperCase();
			  });
			  input[0].selectionStart = input[0].selectionEnd = start;
	});
	
	$(document).keyup(function(event) {
		if (event.keyCode == 13) {
			$("#Submit").click();
		}
	})
   
	$("#Submit").click(function(){
		var SearchQuery	= $("#Query").val();
		var IPMask		= /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		var SubnetMask	= /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\/\d+$/;
		var ASNMask		= /([A])([S])\w(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)+/;
		
		$(".hide").removeClass("hide");

		if (ASNMask.test(SearchQuery) == true) {
			
			$.getJSON('//api.trnog.net/scan/dns/as/' + SearchQuery.replace('AS','') + '?count=1', function(data, status) {
				if (data.status == true) {
					var ControlData	= data.data;
					$(".Result").append('<tr><td colspan="5">' + SearchQuery + ' otonom numarasında <b>' + ControlData + '</b> IP adresi tespit edildi.</td></tr>');
				}
			});
		
			
		} else if (SubnetMask.test(SearchQuery) == true) {
			
			$.getJSON('//api.trnog.net/scan/dns/subnet/' + SearchQuery + '?count=1', function(data, status) {
				if (data.status == true) {
					var ControlData	= data.data;
					$(".Result").append('<tr><td colspan="5">' + SearchQuery + ' subnetinde <b>' + ControlData + '</b> IP adresi tespit edildi.</td></tr>');
				}
			});
				
		} else if (IPMask.test(SearchQuery) == true) {
			
			$.getJSON('//api.trnog.net/scan/dns/subnet/' + SearchQuery + '/32', function(data, status) {
				if (data.status == true) {
					var ControlData	= data.data;
					if (ControlData.length == 1) {
						$(".Result").append('<tr><td><a href="https://stat.ripe.net/' + data.data[0].as_number + '" target="_blank">' + data.data[0].as_number + '</a></td><td><a href="https://stat.ripe.net/' + data.data[0].ip_address + '" target="_blank">' + data.data[0].ip_address + '</a></td><td>' + data.data[0].query_result + '</td><td>' + data.data[0].scan_date + '</td></tr>');	
					} else {
						$(".Result").append('<tr><td colspan="5">' + SearchQuery + ' IP adresi için herhangi bir kayıt bulunamadı.</td></tr>');
					}
				} else {
					location.href = 'TooManyRequests.html';
				}
			});
		
		} else {
			alert("Sonuç Bulunamadı!");
		}
		
	});
});
