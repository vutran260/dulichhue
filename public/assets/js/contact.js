$(document).ready(function () {
	$('#test').gmap3({
		map: {
	    options: {
	     	maxZoom: 12 
	    }  
	},
	marker:{
	    address: "Thua Thien Hue, Viet Nam",
	    options: {
	     	icon: new google.maps.MarkerImage(
	       		"assets/images/google-map-icon.png",
	       		new google.maps.Size(130, 130, "px", "px")
	     	)
	    }
	 	}
	},
	"autofit" );
})
