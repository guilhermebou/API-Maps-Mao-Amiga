function initMap(position) {
    var minhaLocalizacao = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        center: minhaLocalizacao,
        zoom: 14
    });

    var service = new google.maps.places.PlacesService(map);

    var request = {
        location: minhaLocalizacao,
        radius: '4000',
        keyword: 'psicologo'
    };

    service.nearbySearch(request, function(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                var place = results[i];

                var marker = new google.maps.Marker({
                    map: map,
                    position: place.geometry.location
                });

                var infoWindow = new google.maps.InfoWindow();

                marker.addListener('click', (function(marker, place) {
                    return function() {
                        var contentString = '<div><strong>' + place.name + '</strong><br>' +
                                            place.vicinity + '<br>' +
                                            'Rating: ' + (place.rating || 'Sem avaliação') + '<br>';

                        if (place.photos && place.photos.length > 0) {
                            var photoUrl = place.photos[0].getUrl({maxWidth: 200, maxHeight: 200});
                            contentString += '<img src="' + photoUrl + '" alt="Foto do local"><br>';
                        }

                        contentString += '</div>';
                        infoWindow.setContent(contentString);
                        infoWindow.open(map, marker);
                    };
                })(marker, place));
            }
        }
    });
}

function handleLocationError(browserHasGeolocation, map, pos) {
    var infoWindow = new google.maps.InfoWindow({
        map: map
    });
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Erro: O serviço de geolocalização falhou.' :
                          'Erro: Seu navegador não suporta geolocalização.');
}

function loadMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(initMap, function() {
            handleLocationError(true, map, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, map, {lat: -18.723809959886967, lng: -47.52410171004336});
    }
}
