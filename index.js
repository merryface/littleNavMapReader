// Function to change coordinates into degrees and minutes
const toDegreesMinutesAndSeconds = coordinate => {
  const absolute = Math.abs(coordinate);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  // const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  //return degrees + " " + minutes + " " + seconds;
  return `${degrees}${minutes}`;
}

// Degrees to convert decimal coordinates into DMS coordinates
const convertDMS = (lat, lng) => {
  let latitude = toDegreesMinutesAndSeconds(lat);
  const latitudeCardinal = lat >= 0 ? "N" : "S";

  if (latitude.length < 4) {
    latitude += "0"
  }
  if (latitude.length < 3) {
    latitude += "0"
  }

  let longitude = toDegreesMinutesAndSeconds(lng);
  const longitudeCardinal = lng >= 0 ? "E" : "W";
  
  if (longitude < 10000) {
    longitude = "0" + longitude;
  }
  if (longitude < 1000) {
    longitude = "0" + longitude;
  }
  
  return `${latitude}${latitudeCardinal}${longitude}${longitudeCardinal}`;
}

 // User selects file from disc
  document.getElementById('inputfile')
      .addEventListener('change', function() {
      const fr=new FileReader();
      fr.onload=function(){
        // turn data into text
        text = fr.result;

        // Split the strings into an array, one item per line
        planData = fr.result.split(`\n`);

        let airports = [];
        let routeInfo = [];

        planData.forEach(line => {
          // Add all airport ICAOs into array
          if (line.substr(9)[0] == "I") {
            const airportElement = line.match("<Ident>(.*?)</Ident>");
            airports.push(airportElement[1]);
          }

          // Add all coordinates into array
          if (line.substr(9)[0] == "P") {
            const long = line.match(`Lon="(.*?)"`)[1];
            const lat = line.match(`Lat="(.*?)"`)[1];

            routeInfo.push(convertDMS(lat, long))
          }
        })

        // create strings to be output
        const summary = airports.join(" ");
        const info = routeInfo.join(" \n ");


        //Departure
        document.getElementById('departureAirport').textContent=airports[0];

        //Destination
        document.getElementById('destinationAirport').textContent=airports[airports.length-1];

        // Route summary
        document.getElementById('routeSummary').textContent=summary;

        // Route info
        document.getElementById('routeData').innerText=info;
      }
            
      fr.readAsText(this.files[0]);
  })