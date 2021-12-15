var gameMode = 'titlemode';

var camrot;

AFRAME.registerComponent('camrot', {
    init: function () {
            },
    tick: function (time) {
        var quaternion = new THREE.Quaternion();
    
        return function () {
          camrot = this.el.object3D.getWorldQuaternion(quaternion);
          // position and rotation now contain vector and quaternion in world space.
        };
    }

});

AFRAME.registerComponent('click-to-shoot', {
init: function () {
    document.body.addEventListener('mousedown', () => { this.el.emit('shoot'); });
}
});

AFRAME.registerComponent('hit-handler', {
init: function () {
    var el = this.el;

    el.addEventListener('hit', () => {
        console.log('hitted');
        color = new THREE.Color();
        color.setRGB(1, 0, 0);
        el.components.material.material.color.copy(color);        
    });

    el.addEventListener('die', () => {
        console.log('die!');

        document.getElementById('gameux').style.display = 'none';
        document.getElementById('quizux').style.display = 'block';
        gameMode = 'quizready';
    });
}
});

AFRAME.registerComponent('brandon-hit', {
    init: function () {
        var el = this.el;
/*    
        el.addEventListener('hit', () => {
            console.log('hitted');
            color = new THREE.Color();
            color.setRGB(1, 0, 0);
            el.components.material.material.color.copy(color);        
        });
    
        el.addEventListener('die', () => {
            console.log('die!');
    
            document.getElementById('gameux').style.display = 'none';
            document.getElementById('quizux').style.display = 'block';
            gameMode = 'quizready';
        });
*/
    },
    tick: function(time) {
//        console.log( 'position changed : ' + this.el.object3D.position );
    },

    });

AFRAME.registerComponent('brandon-shoot', {
    init: function () {
//        document.body.addEventListener('mousedown', () => { this.shootone(); });
    },

    shootone() {
        let scene = document.querySelector('a-scene');
        let model = document.createElement('a-entity');
        
        model.setAttribute('gltf-model', 'url(./assets/arrow.gltf)');

/*        
        let dir = new THREE.Vector3( 0, 0, -1 );

        model.setAttribute('gltf-model', 'url(./assets/arrow.gltf)');

        model.object3D.scale = this.el.object3D.scale;

        let pos = new THREE.Vector3( this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z );

        let posi = this.el.object3D.getWorldPosition(pos);
        model.object3D.position = posi;

        let rot = this.el.object3D.getWorldDirection(dir);

        model.object3D.rotateY(rot.x);
        model.object3D.rotateX(-rot.y);
*/
        model.object3D.scale = this.el.object3D.scale;
        model.object3D.position = this.el.object3D.position;
        model.object3D.rotation = this.el.object3D.rotation;

        model.setAttribute('arrowshoot', '');

        this.el.appendChild(model);

//        console.log('shoot : ' + rot.y);
    },
});
    
document.addEventListener('DOMContentLoaded', init, false);

function init(){
		// 게임 UX에서 처음으로 돌아가기 버튼 누를때 처리
		console.log('what obj ' + document.getElementById('whathomebutton') );
		document.getElementById('whathomebutton').addEventListener('mousedown', function () {
			document.getElementById('whathomebutton').style.display = 'none';
		});
};

window.onload = () => {
/*
    const button = document.querySelector('button[data-action="change"]');
    button.innerText = '﹖';

    let places = staticLoadPlaces();
    renderPlaces(places);
    const ui = document.getElementById('firstux');
    ui.setAttribute('visible', true);
*/
/*
    var tex = new THREE.TextureLoader().load('./assets/lambert1_baseColor.png');
    tex.flipY = false; // for glTF models.

    document.getElementById('gun').addEventListener('model-loaded', function (e) {
        e.detail.model.traverse(function(node) {
            if (node.isMesh) { 
                node.material.map = tex;

                node.material.shader="flat";

                console.log('texture changed : ' + tex);
            }
        });
    });
*/

    // 첫번째 UX에서 스타트 버튼 누를때 처리
    document.getElementById('startgamebutton').addEventListener('click', function () {
        document.getElementById('firstux').style.display = 'none';

        // 몰리 에니메이션 시작
        document.getElementById('molymodel').setAttribute('molystart','');

        var entity = document.getElementById('bgm');
        entity.components.sound.playSound();        
    });

    // 첫번째 UX에서 도움말 버튼 누를때 처리
    document.getElementById('helpbutton').addEventListener('click', function () {
        document.getElementById('firstux').style.display = 'none';
        document.getElementById('helpux').style.display = 'block';
        gameMode = 'titlehelp';

        var entity = document.getElementById('bgm');
        entity.components.sound.playSound();        
    });

    // 도움말 ux에서 확인 버튼 누를때 처리
    document.getElementById('helpokbutton').addEventListener('click', function () {
        if ( gameMode === 'titlehelp') {
            document.getElementById('firstux').style.display = 'block';
            document.getElementById('helpux').style.display = 'none';
            gameMode = 'titlemode';
        }
    });

	


    // 최초 로딩 완료후 UX표시
    document.querySelector('a-scene').addEventListener('loaded', function () {
//        document.getElementById('firstux').style.display = 'block';
        document.getElementById('gameux').style.display = 'block';
    });




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
        url: './assets/sol_v02.glb',
        scale: '0.5 0.5 0.5',
        info: 'Magnemite, Lv. 5, HP 10/10',
        rotation: '0 180 0',
        position: '0 0 15',
    },
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.2 0.2 0.2',
        rotation: '0 180 0',
        position: '0 0 -10',
        info: 'Articuno, Lv. 80, HP 100/100',
    },
    {
        url: './assets/magnemite/scene.gltf',
        scale: '0.08 0.08 0.08',
        rotation: '0 180 0',
        position: '0 -10 0',
        info: 'Dragonite, Lv. 99, HP 150/150',
    },
];

var modelIndex = 0;
var setModel = function (model, entity) {
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

    if ( modelIndex == 1 ) {
        entity.setAttribute('solchr', '');
    }
/*
    const div = document.querySelector('.instructions');
    div.innerText = model.info;
*/    
};

function renderPlaces(places) {
    let scene = document.querySelector('a-scene');

    places.forEach((place) => {
        let latitude = place.location.lat;
        let longitude = place.location.lng;

        let model = document.createElement('a-entity');
        model.setAttribute('gyro-entity-object', `latitude: ${latitude}; longitude: ${longitude};`);

        setModel(models[modelIndex], model);

        model.setAttribute('animation-mixer', '');

        document.querySelector('button[data-action="change"]').addEventListener('click', function () {
            var entity = document.querySelector('[gyro-entity-object]');
            modelIndex++;
            var newIndex = modelIndex % models.length;
            setModel(models[newIndex], entity);
        });

        scene.appendChild(model);
        
    });
}