(function () {
  var init = function() {
    handleScreens();
  }
  
  var handleScreens = function() {
    let screens = document.querySelectorAll('.step');
    const container = document.querySelector('form');
    let options = [];

    document.querySelector('body').addEventListener('keydown', function() {
      const currentScreen = document.querySelector('.step.active');
      if (currentScreen.nextElementSibling) {
        if (event.which === 13) {
          for (let i = 0; i < screens.length; i++) {
            screens[i].classList.remove('active')
          }

          options.push(currentScreen.querySelector('.input').value);
          currentScreen.nextElementSibling.classList.add('active');
          currentScreen.nextElementSibling.querySelector('.input') ? currentScreen.nextElementSibling.querySelector('.input').focus() : '';
        }
      }
    });

    document.querySelector('button').addEventListener('click', function() {
      calculateTime(options);
    });
  }

  var calculateTotal = function(options, partialMinutes) {
    const breakfastTime = options[4] === 'no' ? 0 : Math.floor(Math.random()*(30-15+1)+15);
    const bathingTime = options[5] === 'no' ? 0 : Math.floor(Math.random()*(25-10+1)+10);
    const total = partialMinutes + breakfastTime*60 + bathingTime*60;
    const desiredTimeOfArrival = options[2].split(':');
    const date = new Date();

    date.setHours(desiredTimeOfArrival[0], desiredTimeOfArrival[1], 0, 0);
    date.setMinutes(date.getMinutes() - (total/60));

    const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
    const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();

    document.querySelector('.result').innerHTML = `You should set your alarm at ${hours}:${minutes}`;
  }

  var calculateTime = function(options) {
    fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?origins=${options[0]}&destinations=${options[1]}&mode=${options[3]}&key=AIzaSyCJpw-LH82RevpaarbB3PW4qoWEAR9xauU`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.status === 'INVALID_REQUEST') {
          document.querySelector('.result').innerHTML = 'You must provide a valid address and destination';
        } else {
          const result = json.rows[0].elements[0];

          if (result.status === 'ZERO_RESULTS') {
            document.querySelector('.result').innerHTML = 'No results available with selected mode of transportation';
          } else {
            const minutesToDestination = json.rows[0].elements[0].duration.value;

            calculateTotal(options, minutesToDestination);
          }
        }
      });
  }

  init();
}());

function initAutocomplete() {
  autocomplete = new google.maps.places.Autocomplete(document.getElementById('address'), {types: ['geocode']});
  autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('destination'), {types: ['geocode']});
  autocomplete.addListener('place_changed', fillInAddress);
  autocomplete2.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  var place = autocomplete.getPlace();
}
