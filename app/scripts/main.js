"use strict";
// global array of months
let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

document.getElementById('styledSelect2').addEventListener('click', function (event) {
	// Log the clicked element in the console
	let option = document.getElementById('styledSelect1').value;
	let location = getLocation(option)
}, false)

document.getElementById('styledSelect3').addEventListener('click', function (event) {
	// Log the clicked element in the console
	let option = document.querySelector('.custom-container-2');
	console.log(option.innerHTML);
	option.innerHTML = "";
}, false)

function getLocation(location_id) {
	let url = "https://www.metaweather.com/api/location/" + location_id
	let test = this;
	let xhr = new XMLHttpRequest();
	// Setup our listener to process completed requests
	xhr.onload = function () {
		// Process our return data
		if (xhr.status >= 200 && xhr.status < 300) {
			// What do when the request is successful
			loadLocationWeather(JSON.parse(xhr.response))
		} 
		else if(xhr.status >= 400 && xhr.status < 500){
			alert('Location not found or not provided');
		}
		else {
			// What do when the request fails
			alert('The request failed!');
		}
	};
	xhr.open('GET', url);
	xhr.send();
}

function loadLocationWeather(location) {
	
	let weather_location = document.getElementById('location')
	let current_temp = document.getElementById('current-temperature')
	let weather_state = document.getElementById('weather-state')
	let min_temp = document.getElementById('min-temperature')
	let max_temp = document.getElementById('max-temperature')
	let wind_direction = document.getElementById('wind-direction')

	let today_date = new Date(location.consolidated_weather[0].applicable_date)
	let today_month = today_date.getMonth() + 1
	let view = `
	<div class="today-weather">
		<div>
			<p id="today-date">`+ today_month + `/` + today_date.getDate() +`</p>
			<p id="location">` + location.parent.title + `, ` + location.title +`</p>
			<h1 id="current-temperature">`+ parseInt(location.consolidated_weather[0].the_temp) + `<i class="wi wi-celsius"></i></h1>			
			<div>
				<p id="min-temperature">` + parseInt(location.consolidated_weather[0].min_temp) + `<i class="wi wi-celsius"></i></p>
				<p id="max-temperature">` + parseInt(location.consolidated_weather[0].max_temp) + `<i class="wi wi-celsius"></i></p>
			</div>
			<p id="weather-state">` + location.consolidated_weather[0].weather_state_name + `</p>
			<p>Precipitation ` + parseInt(location.consolidated_weather[0].predictability) + `</p>
			<p>Humidity: ` + parseInt(location.consolidated_weather[0].humidity) + `%</p>
			<p id="wind-direction">Wind Direction: ` + location.consolidated_weather[0].wind_direction_compass + `</p>
		</div>
		<img class="weather-icon-today" id="weather-state-icon" src="https://www.metaweather.com/static/img/weather/` + location.consolidated_weather[0].weather_state_abbr + `.svg">
	</div>
	<div class="forecast">
	`;

	for(let i=1;i<location.consolidated_weather.length;i++){
		let element_date = new Date(location.consolidated_weather[i].applicable_date)
		let month = element_date.getMonth() + 1
		view += `
			<div class="item">
				<div class="weather-wrapper">
					<div class="weather-card madrid">
						<img class="weather-icon" id="weather-state-` + element_date.getDate() +`" src="https://www.metaweather.com/static/img/weather/png/64/`+ location.consolidated_weather[i].weather_state_abbr +`.png">
						<h1>`+ parseInt(location.consolidated_weather[i].the_temp) +`º</h1>
						<p>`+ month + `/` + element_date.getDate() +`</p>
					</div>
				</div>
			</div>
		`
	} 
	view += ``
	let option = document.querySelector('.custom-container-2');
	option.innerHTML = view;
}

function loadLocationList(callback) {   

    let xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/scripts/states.json', true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
 }

 document.addEventListener("DOMContentLoaded", function() {
	// loads locations in select
	loadLocationList(function(response){
		let daySelect = document.getElementById('styledSelect1');
		response = JSON.parse(response)
		response.forEach(element => {
			daySelect.options[daySelect.options.length] = new Option(element.name, element.id);
		}); 		
	});
	// create months array for better display
	 
  });
