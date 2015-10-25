/**
 * 
 */
(function() {
	window.onload = function() {
		// Creating a MapOptions object with the required properties
			var poiObject = [];
			var options = {
	    					zoom: 4,
	    					center: new google.maps.LatLng(-34.0, -58.0),
	    					mapTypeId: google.maps.MapTypeId.ROADMAP
	    			};

			// Creating the map
			var map = new google.maps.Map(document.getElementById('map'), options);
			google.maps.event.trigger(map, 'resize');

			function show_me_in_map(position) {
				var lat = position.coords.latitude;
				var lon = position.coords.longitude;
	
				var myplace =  new google.maps.LatLng(lat,lon);
	
				var marker = new google.maps.Marker({
					position: myplace,
					map: map,
					title: 'You are here. '
					});
				map.setCenter(myplace);
				map.setZoom(19);
			};
			navigator.geolocation.getCurrentPosition(
				show_me_in_map
				);
			// Getting values
			document.getElementById('getValues').onclick = function() {
				alert('Current Zoom level is ' + map.getZoom());
				alert('Current center is ' + map.getCenter());
			};			
	};
})();

