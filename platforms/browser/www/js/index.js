/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
				initializeApp();
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('Received Event: ' + id);
    }
};

app.initialize();

function initializeApp() {
	// $("#map-page").on("pagecreate", function(event){
		// initMap();
	// });
}



/*==============================Map Page=================================================*/

var map;
var userId = null;

var apiUrl = "http://parkbook.azurewebsites.net";

//initializing the map on page load
function initMap() {		
		
		// adding a map centered at stockholm
		map = L.map('map').setView([59.33, 18.07], 12);		
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
				maxZoom: 18					
		}).addTo(map);
		console.log("readfy");
		// adding a location listener -> docs: https://cordova.apache.org/docs/en/3.0.0/cordova_geolocation_geolocation.md.html
		navigator.geolocation.getCurrentPosition(onLocationSuccess, onLocationError);	
		
		
		
}

/*==============================Location Listener=================================================*/

var onLocationSuccess = function(position) {
	var latlon = L.latLng(position.coords.latitude, position.coords.longitude);
	L.circle(latlon,5).addTo(map);
	map.flyTo(latlon,17);
};

// onError Callback receives a PositionError object 
function onLocationError(error) {
	console.log('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
}

/*============================== Submitting forms =================================================*/

function submitLogin() {
	var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
	
	//calling server API to login with given username and password
	var request = $.ajax({
			url: apiUrl + "/user/login",
			type: "GET",
			data: { username: username, password: password },
			cache: false
	});

	//after request is resolved
	request.done(function(data,textStatus,jqXHR) {
		document.getElementById('login-errorLabel').textContent = "";
		userId = data.id;
		
		goToMapPage();
		
	});

	//if request fails
	request.fail(function(jqXHR, textStatus, errorThrown) {
		switch (jqXHR.status) {
			case 400:
				document.getElementById('login-errorLabel').textContent = "Wrong user name or password.";
				break;
			default:
				document.getElementById('login-errorLabel').textContent = "Server error.";
		}
	});
}

function submitRegister() {
	var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  var license_plate = document.getElementById('license_plate').value;
	
	if(username.length == 0 || password.length == 0 || license_plate.length == 0) {
		document.getElementById('register-errorLabel').textContent = "Missing field. All fields are required.";
	}
	else {
		var newUser = JSON.stringify({name: username, password: password, license_plate: license_plate});
		console.log(newUser);
		
		var request = $.ajax({
				url: apiUrl + "/user",
				type: "POST",
				contentType: "application/json",
				data: newUser,
				cache: false
		});

		//after request is resolved
		request.done(function(data,textStatus,jqXHR) {
			document.getElementById('register-errorLabel').textContent = "";
			
			goToHomePage();
			
		});

		//if request fails
		request.fail(function(jqXHR, textStatus, errorThrown) {
			switch (jqXHR.status) {
				case 409:
					document.getElementById('register-errorLabel').textContent = "User name or license plate is already taken.";
					break;
				default:
					document.getElementById('register-errorLabel').textContent = "Server error.";
			}
		});
	}	
}

/*============================== Navigation =================================================*/

function goToRegisterPage() {
	window.location.href = "register.html";
}

function goToHomePage() {
	window.location.href = "index.html";
}

function goToMapPage() {
	window.location.href = "map.html";
}