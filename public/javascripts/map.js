/**
 * 
 */
function initMap() {
	window.onload = function() {
		// Creating a MapOptions object with the required properties
			var options = {
	    					zoom: 4,
	    					center: new google.maps.LatLng(-34.0, -58.0),
	    					mapTypeId: google.maps.MapTypeId.ROADMAP,
							disableDefaultUI: true
	    			};

			// Creating the map
			var map = new google.maps.Map(document.getElementById('map'), options);
 			var infoWindow = new google.maps.InfoWindow({map: map});

  			// Try HTML5 geolocation.
  			if (navigator.geolocation) {
    			navigator.geolocation.getCurrentPosition(function(position) {
      			var pos = {
        			lat: position.coords.latitude,
        			lng: position.coords.longitude
      			};

      			infoWindow.setPosition(pos);
      			infoWindow.setContent('Estás aquí.');
      			map.setCenter(pos);
				map.setZoom(19);
    			}, function() {
      				handleLocationError(true, infoWindow, map.getCenter());
				
    			});
  			} else {
    			// Browser doesn't support Geolocation
    			handleLocationError(false, infoWindow, map.getCenter());
  			}
			// Checking map values
			
			 function updateMap(){
				infoWindow.setPosition(map.getCenter());
				if(map.getZoom()<19){
					infoWindow.setContent('Acerque el zoom al lugar');
				} else {
					infoWindow.setContent('Centre el mapa en el lugar');
					document.getElementById("cpa_lat").value = map.getCenter().lat();
					document.getElementById("cpa_lng").value = map.getCenter().lng();
				}
			};
			map.addListener('zoom_changed',updateMap);
			map.addListener('dragend',updateMap);
			
			// Getting values
			document.getElementById('getValues').onclick = function() {
				alert('Current Zoom level is ' + map.getZoom());
				alert('Current center is ' + map.getCenter());
				alert('Current center is ' + map.getCenter().lat());
				alert('Current center is ' + map.getCenter().lng());
			};			
	};
	
};

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
                        'Acerque el zoom al lugar que desea registrar' :
                        'Error: Algo falló.');
}

function detectBrowser() {
  var useragent = navigator.userAgent;
  var mapdiv = document.getElementById("map");

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    mapdiv.style.width = '100%';
    mapdiv.style.height = '400px';
  } else {
    mapdiv.style.height = '800px';
  }
}