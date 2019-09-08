"use strict";
// global var to save favorite locations
let myFavorites = []
let currentCallback
//Overrides alerts from javascript
// override default browser alert
window.alert = function(msg, callback){
	let message = document.querySelector('.message')
	message.textContent = msg
	let custom_alert = document.querySelector('.customAlert')
	custom_alert.style.animation = "fadeIn 0.3s linear"
	custom_alert.style.display = "inline"
	setTimeout(function(){
		custom_alert.style.animation =  'none';
	}, 300);
	
	currentCallback = callback;
  }
// Hanldles confirm button in the alert 
document.addEventListener('click', function(event){
	if (!event.target.matches('.confirmButton')) return;
	let custom_alert = document.querySelector('.customAlert')
	custom_alert.style.animation = "fadeOut 0.3s linear"
	setTimeout(function(){
		custom_alert.style.animation =  'none';
		custom_alert.style.display =  'none';
	}, 300);
})
// Handles Find location's weather click event
document.addEventListener('click', function (event) {
	
	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#styledSelect2')) return;
	// Loads location's weather based on the input selected in the dropdown	
	let option = document.getElementById('styledSelect1').value;
	let location = getLocation(option)
}, false);
// Handles Clear location's weather click event
document.getElementById('styledSelect3').addEventListener('click', function (event) {
	// Clears current location's weather info
	let option = document.querySelector('.custom-container-2');
	option.innerHTML = "";
}, false)
// Handles Find location's weather click event
document.addEventListener('click', function (event) {
	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('.favorite-location')) return;
	// Loads location's weather based on the input selected in the dropdown
	console.log(event.target)
	getLocation(event.target.closest(".weather-card-horizontal").id)

}, false);
// Handles favorite icon click event
document.addEventListener('click', function (event) {

	// If the clicked element doesn't have the right selector, bail
	if (!event.target.matches('#favorite-icon-today')) return;
	// Adds current location to the list of favorites only if the amount of favorites is less than 3
	if(myFavorites.length < 3){
		let location_id = document.getElementById('today-id').innerHTML
		let location_name = document.getElementById('hidden-location').innerHTML
		// flag to know if the locations exist in favorite locations
		let exist = false
		myFavorites.forEach(function(item){
			if(item.id == location_id){
				exist = true
				alert("Location already in favorites")
				return;
			}
		});

		if(!exist){
			var location = {
				"id":location_id,
				"name":location_name
			}
			myFavorites.push(location)
			loadFavoritesLocation()
		}		
		
	}else{
		alert("Maximun number of locations reached")
	}

}, false);
// Handles remove icon click event
document.addEventListener('click', function (event) {
	
	if (!event.target.matches('#remove-favorite')) return;
	// Log the clicked element in the console
	myFavorites.forEach(function(item,index){
		if(item.id == event.target.closest(".weather-card-horizontal").id){
			myFavorites.splice(index,1);
			let closestParent = event.target.closest('.weather-wrapper-horizontal');
			closestParent.parentNode.removeChild(closestParent)
		}
		
	})

}, false);
// Handles DOMContentLoaded event to fill location's list dynamically
document.addEventListener("DOMContentLoaded", function() {
	// loads locations in select
	loadLocationList(function(response){
		let daySelect = document.getElementById('styledSelect1');
		response = JSON.parse(response)
		response.forEach(element => {
			daySelect.options[daySelect.options.length] = new Option(element.name, element.id);
		}); 		
	});	 
  });
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
// LoadS dynamically the favorite locations
function loadFavoritesLocation(){

	myFavorites.forEach(function(item){
		if(!document.getElementById(item.name)){
			let div = document.createElement("div")
			div.classList.add("weather-wrapper-horizontal");
			div.innerHTML = `
				<div class="weather-card-horizontal animated slideInRight" id="` + item.id + `">					
					<h1 id="` + item.name + `" class="favorite-location">` + item.name + `</h1>                        
					<img class="weather-icon-horizontal" id="remove-favorite" src="https://image.flaticon.com/icons/svg/0/39.svg" alt="remove icon">
				</div>
			`
			// Get the reference node
			let referenceNode = document.querySelector('#favorite');
	
			// Insert the new node before the reference node
			referenceNode.after(div);
		}		
	})

	
}
// Loads today weather and forecast
function loadLocationWeather(location) {

	let today_date = new Date(location.consolidated_weather[0].applicable_date)
	let today_month = today_date.getMonth() + 1
	let view = `
	<div class="today-weather animated fadeIn">
		<div>
			<p id="today-id" hidden>`+ location.woeid +`</p>
			<p id="hidden-location" hidden>` + location.title + `</p>
			<p id="today-date">`+ today_month + `/` + today_date.getDate() +`</p>
			<p id="location">` + location.parent.title + `, ` + location.title +`</p>
			<h1 id="`+ parseInt(location.consolidated_weather[0].the_temp) + `" class="current-temperature">`+ parseInt(location.consolidated_weather[0].the_temp) + `<i class="wi wi-celsius"></i></h1>			
			<div class="col">
				<p id="min-temperature">` + parseInt(location.consolidated_weather[0].min_temp) + `<i class="wi wi-celsius"></i></p>
				<p id="max-temperature">` + parseInt(location.consolidated_weather[0].max_temp) + `<i class="wi wi-celsius"></i></p>
			</div>
			<p id="weather-state">` + location.consolidated_weather[0].weather_state_name + `</p>
			<p><i class="fas fa-cloud-rain"></i>Precipitation: ` + parseInt(location.consolidated_weather[0].predictability) + `</p>
			<p><i class="fas fa-tint"></i>Humidity: ` + parseInt(location.consolidated_weather[0].humidity) + `%</p>
			<p id="wind-direction"><i class="fas fa-wind"></i>Wind Direction: ` + location.consolidated_weather[0].wind_direction_compass + ` </p>
		</div>
		<div class="row-reverse">                    
			<img class="favorite-icon-today" id="favorite-icon-today" alt="favorite icon" src="https://downloadfreesvgicons.com/icons/shape-icons/svg-red-heart-icon-1/svg-red-heart-icon-1.svg">
			<img class="weather-icon-today" id="weather-state-icon" alt="` + location.consolidated_weather[0].weather_state_name + `" src="https://www.metaweather.com/static/img/weather/` + location.consolidated_weather[0].weather_state_abbr + `.svg">
		</div> 
		
	</div>
	<div class="forecast">
	`

	for(let i=1;i<location.consolidated_weather.length;i++){
		let element_date = new Date(location.consolidated_weather[i].applicable_date)
		let month = element_date.getMonth() + 1
		view += `
			<div class="item animated bounceInUp">
				<div class="weather-wrapper">
					<div class="weather-card madrid">
						<img class="weather-icon" id="weather-state-` + element_date.getDate() +`" alt="` + location.consolidated_weather[i].weather_state_name + `" src="https://www.metaweather.com/static/img/weather/png/64/`+ location.consolidated_weather[i].weather_state_abbr +`.png">
						<h1>`+ parseInt(location.consolidated_weather[i].the_temp) +`º</h1>
						<p>`+ month + `/` + element_date.getDate() +`</p>
					</div>
				</div>
			</div>
		`
	} 
	let option = document.querySelector('.custom-container-2');
	option.innerHTML = view;
	let temperature = parseInt(document.querySelector('.current-temperature').id);

	if (temperature > 23){
		document.querySelector('.today-weather').classList.add('hot-weather')
	}else if(temperature < 14){
		document.querySelector('.today-weather').classList.add('cold-weather')
	}else{
		document.querySelector('.today-weather').classList.add('normal-weather')
	}
	
}
// Loads list of availables locations
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

