window.onload = () => {
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    let places = staticLoadPlaces();

    let nowpos = navigator.geolocation.getCurrentPosition(function (position) {

        console.log("what loc : " + position);

        return position.coords;
    });

    if ( nowpos == undefined ) {
        nowpos = {"latitude":0, "longitude":0};
    }

    console.log( 'whata the :' + JSON.stringify(nowpos) + ":" + JSON.stringify(places[0]));
    


    places[0].location.lat = nowpos.latitude;
    places[0].location.lng = nowpos.longitude;

    console.log( JSON.stringify(places[0]) );

    renderPlaces(places[0]);
};

function staticLoadPlaces() {
    return [
        {
            name: 'Pokèmon',
            location: {
                lat: 37.478545,
                lng: 126.916387,
            },
        },
    ];
}

var models = [
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
    },
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
];

var modelIndex = 0;
var setModel = function (model, entity, addstr) {
    if (model.scale) {
        entity.setAttribute('scale', model.scale);
    }

    if (model.rotation) {
        entity.setAttribute('rotation', model.rotation);
    }

    if (model.position) {
        entity.setAttribute('position', model.position);
    }

    entity.setAttribute('gltf-model', model.url);

    const div = document.querySelector('.instructions');
    div.innerText = addstr;//model.info;
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    let latitude = places.location.lat;
    let longitude = places.location.lng;

    let model = document.createElement('a-entity');
    model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

    setModel(models[modelIndex], model);

    model.setAttribute('animation-mixer', '');

    document.querySelector('button[data-action="change"]').addEventListener('click', function () {
        var entity = document.querySelector('[gps-entity-place]');
        modelIndex++;
        var newIndex = modelIndex % models.length;

        var addstr = "lat : " + latitude + ", long : " + longitude + ", model : " + newIndex;

        setModel(models[newIndex], entity, addstr );
    });

    scene.appendChild(model);
}