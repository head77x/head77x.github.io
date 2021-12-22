var gameMode = 'titlemode';		// 현재 게임 포커스 상태

var camrot;

var quizs = [ 
	{ text: "OX퀴즈\n\n디지로그 서소문에서 세무, 부동산, 해외투자 전문가와 상담을 무료로 제공하고 있다.", correct: 0, result: "정답입니다!\n\n디지로그 서소문에서 세무, 부동산, 해외투자 전문가와 상담을 무료로 제공하고 있습니다!" },
	{ text: "OX퀴즈\n\n상상 갤러리에서 취미로 그렸던 작품, 가족이나 연인, 친구와의 소중한 추억을 전시할 수 있다.", correct: 0, result: "정답입니다!\n\n상상 갤러리에서 취미로 그렸던 작품, 가족이나 연인, 친구와의 소중한 추억을 전시할 수 있습니다!" },
	{ text: "OX퀴즈\n\n어디서든 예쁘게 사진 찍고 해시태그 #신한은행 #디지로그 #서소문과 함께 본인 인스타 계정에 업로드 하면 자판기에서 선물을 받을 수 있다.", correct: 0, result: "정답입니다!\n\n어디서든 예쁘게 사진 찍고 해시태그 #신한은행 #디지로그 #서소문과 함께 본인 인스타 계정에 업로드 하면 자판기에서 선물을 받을 수 있습니다!" },
	{ text: "OX퀴즈\n\n디지로그 서소문에는 원하는 시간에 원하는 상담을 받을 수 있는 상담 예약서비스가 없다.", correct: 1, result: "정답입니다!\n\n디지로그 서소문에는 원하는 시간에 원하는 상담을 받을 수 있는 상담 예약서비스가 있습니다!" },
	{ text: "OX퀴즈\n\n매주 수요일 오후 12시30분 부터 신한은행의 유명한 강사(오건영 부부장, 우병탁 세무사 등)의 명강의를 유투브와 디지로그 서소문 스튜디오에서 들을 수 없다.", correct: 1, result: "정답입니다!\n\n매주 수요일 오후 12시30분 부터 신한은행의 유명한 강사(오건영 부부장, 우병탁 세무사 등)의 명강의를 유투브와 디지로그 서소문 스튜디오에서 들을 수 있습니다!" },
	{ text: "OX퀴즈\n\n디지로그 서소문에서는 금융과 비금융의 결합된 다양한 전시회(캠핑카, 전기차, 오토바이 등) AR체험을 통해 새로운 고객 경험을 제공하고 있다.", correct: 0, result: "정답입니다!\n\n디지로그 서소문에서는 금융과 비금융의 결합된 다양한 전시회(캠핑카, 전기차, 오토바이 등) AR체험을 통해 새로운 고객 경험을 제공하고 있습니다!" },
];

var quizidx = 0;

function showQR() {
/*	
	$.ajax("https://game.digilog-xr.com/app/gameQr")
	.done(function(response) {
		console.log("qr return : " + response.result.qrString);

		document.getElementById('congratux').style.display = 'none';
		document.getElementById('qrux').style.display = 'block';
		
		var qrcode = new QRCode(document.getElementById("qrcode"), {
			text: response.result.qrString,
			width: 200,
			height: 200,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	})
	.fail(function(error) {
		console.log(error);
	});
*/	
document.getElementById('congratux').style.display = 'none';
document.getElementById('qrux').style.display = 'block';

var qrcode = new QRCode(document.getElementById("qrcode"), {
	text: "https://www.naver.com",
	width: 128,
	height: 128,
	colorDark : "#000000",
	colorLight : "#ffffff",
	correctLevel : QRCode.CorrectLevel.H
});
}

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

/*
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
*/

AFRAME.registerComponent('brandon-hit', {
		schema: {
			chrnum: {type: 'number', default: 1},
		},
			
    init: function () {
        this.mydamage = 2;
        this.checker = document.getElementById('gun');
    },
    tick: function(time) {
        if ( this.checker.childNodes.length > 1 )
        {
					this.checker.childNodes.forEach((who, index, sourceArr) => {
						if ( who.object3D != null && this.el.object3D != null ) {
								var arrowpos = new THREE.Vector3( who.object3D.position.x, who.object3D.position.y, who.object3D.position.z );
								who.object3D.getWorldPosition(arrowpos);

								var mypos = new THREE.Vector3( this.el.object3D.position.x, this.el.object3D.position.y, this.el.object3D.position.z );
								this.el.object3D.getWorldPosition(mypos);

//                    console.log('arrowpos: ' +  mypos.distanceTo( arrowpos ));

								if ( mypos.distanceTo( arrowpos ) < 1 ) {

									// 맞는 소리
									var entity = document.getElementById('hitheart');
									entity.components.sound.playSound();        

									this.openquiz();
								}
						}
					});
       }
    },
		openquiz: function() {
			document.getElementById('gameux').style.display = 'none';
			document.getElementById('quizux').style.display = 'block';

			// 해당 캐릭터에 맞는 gif 표시하기
			for ( var i = 1; i < 7; i++ ) {
				document.getElementById('quest' + i).style.display = 'none';				
				document.getElementById('lose' + i).style.display = 'none';				
				document.getElementById('win' + i).style.display = 'none';				
			}

			document.getElementById('quest' + this.data.chrnum).style.display = 'flex';				
			document.getElementById('lose' + this.data.chrnum).style.display = 'flex';				
			document.getElementById('win' + this.data.chrnum).style.display = 'flex';				

			document.getElementById('quiztext').innerText = quizs[quizidx].text;
			gameMode = 'quizready';		// 퀴즈 진행중
			removeAllArrow();

			// 시계 똑딱이는 소리
			var entity = document.getElementById('ticktock');
			entity.components.sound.playSound();        
		}

    });

AFRAME.registerComponent('brandon-shoot', {
    init: function () {
				this.myarrow = null;
        document.body.addEventListener('touchstart', (e) => { this.makeone(e); });
        document.body.addEventListener('touchmove', (e) => { this.moveone(e); });
        document.body.addEventListener('touchend', () => { this.shootone(); });
    },

		makeone(e) {
			if ( gameMode != 'gamemode' ) return;

			let scene = document.querySelector('a-scene');
			let model = document.createElement('a-entity');
			
			model.setAttribute('gltf-model', 'url(./assets/arrow.gltf)');

			model.object3D.scale = this.el.object3D.scale;
			model.object3D.position = this.el.object3D.position;
			model.object3D.rotation = this.el.object3D.rotation;
			model.object3D.position.z = -0.04;

			this.myarrow = this.el.appendChild(model);

			this.startpoint = e.changedTouches[0].clientY;
			this.bowlevel = 0;
		},

		moveone(e) {
			if ( gameMode != 'gamemode' ) return;

			if (this.myarrow != null) {
				let dist = (e.changedTouches[0].clientY - this.startpoint);

				if ( dist > 30 && dist <= 100 ) {
					dist = -0.03;
					this.bowlevel = 1;
					document.getElementById('bow').setAttribute("animation-mixer","clip: ready1; loop: once; duration: 0.5; clampWhenFinished: true;");					
				} else if ( dist > 100 && dist <= 200 ) {
					dist = -0.015;
					this.bowlevel = 2;
					document.getElementById('bow').setAttribute("animation-mixer","clip: ready2; loop: once; duration: 0.5; clampWhenFinished: true;");					
				} else if ( dist > 200 ) {
					dist = -0.005;
					this.bowlevel = 3;
					document.getElementById('bow').setAttribute("animation-mixer","clip: ready3; loop: once; duration: 0.5; clampWhenFinished: true;");					
				} else {
					dist = -0.04;
					this.bowlevel = 0;
					document.getElementById('bow').setAttribute("animation-mixer","clip: ready0; loop: once; duration: 0.5; clampWhenFinished: true;");					
				}

				this.myarrow.object3D.position.z = dist;
			}
		},

    shootone() {
			if (this.myarrow != null) {
				document.getElementById('bow').setAttribute("animation-mixer","clip: shotani; loop: once; duration: 0.5;");					
        this.myarrow.setAttribute("arrowshoot", "shootlevel:" + this.bowlevel + ";");
			}
//        console.log('shoot : ' + rot.y);
    },
});


AFRAME.registerComponent('arrowshoot', {
	schema: {
		shootlevel: {type: 'number', default: 1},
	},
	init: function () {
		this.restart(0);
	},

	restart: function(whattime) {
		this.direction = this.el.object3D.rotation;
		this.moveSpeed = -0.01;
		this.initflag = true;
	},

	tick: function (time) {
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			this.el.object3D.translateZ(this.moveSpeed);
			this.el.object3D.translateY(-0.001 * (2 - this.data.shootlevel) );

			if ( time - this.starttime > 2000 ) {
				this.el.remove();
			}
		}
	}
});

AFRAME.registerComponent('moveanywhere', {
	init: function () {
		this.restart(0);
	},

	restart: function(whattime) {
		this.random_x = ((Math.random() * 2) - 1)/2.0;
		this.random_z = ((Math.random() * 90) - 45);
		this.random_time = whattime + ((Math.random() * 5) * 1000) + 1000;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		if ( time > this.random_time ) {
			this.restart(time);
		}
	}
});

AFRAME.registerComponent('molystart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = 30;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		// Entry#1. 시작버튼 누르면 몰리캐릭터가 2시방향으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			if ( time - this.starttime > 1800 ) {
				// Entry#2. 1.8초후 리노캐릭터 생성 
				document.getElementById('rinostart').setAttribute('rinostart','');
			}
			if ( time - this.starttime > 3000 ) {
				this.el.object3D.visible = false;
				document.getElementById('molystart').removeAttribute('molystart');
			}
		}	
	}
});
AFRAME.registerComponent('rinostart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = -30;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;

		console.log('move dir : ' + this.random_x + "," + this.random_z);
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		// Entry#3. 리노캐릭터가 10시방향으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			// Entry#4. 0.8초 후에 슈캐릭터 생성 
			if ( time - this.starttime > 800 ) {
				document.getElementById('suestart').setAttribute('suestart','');
			}
			if ( time - this.starttime > 3000 ) {
				this.el.object3D.visible = false;
				document.getElementById('rinostart').removeAttribute('rinostart');
			}
		}	
	}
});
AFRAME.registerComponent('suestart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = 15;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		// Entry#5. 슈캐릭터 1시 방향으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
		// Entry#6. 1.2초후에 루루라라 캐릭터 생성
		if ( time - this.starttime > 1200 ) {
				document.getElementById('lulastart').setAttribute('lulastart','');
			}
			if ( time - this.starttime > 3000 ) {
				this.el.object3D.visible = false;
				document.getElementById('suestart').removeAttribute('suestart');
			}
		}	
	}
});
AFRAME.registerComponent('lulastart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = -45;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;

		console.log('move dir : ' + this.random_x + "," + this.random_z);
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		// Entry#7. 루루라라캐릭터 9시 방향으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			// Entry#8. 0.4초후 도레미캐릭터 생성 
			if ( time - this.starttime > 400 ) {
				document.getElementById('dorestart').setAttribute('dorestart','');
			}
			if ( time - this.starttime > 3000 ) {
				this.el.object3D.visible = false;
				document.getElementById('lulastart').removeAttribute('lulastart');
			}
		}	
	}
});
AFRAME.registerComponent('dorestart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = 60;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;

		console.log('move dir : ' + this.random_x + "," + this.random_z);
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));
		// Entry#9. 도레미캐릭터가 4시 방향으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			// Entry#10. 1.2초후 솔 캐릭터 생성
			if ( time - this.starttime > 1200 ) {
				document.getElementById('solstart').setAttribute('solstart','');
			}
			if ( time - this.starttime > 3000 ) {
				this.el.object3D.visible = false;
				document.getElementById('dorestart').removeAttribute('dorestart');
			}

		}	
	}
});
AFRAME.registerComponent('solstart', {
	init: function () {
		this.random_x = 0.5;//((Math.random() * 2) - 1)/10;
		this.random_z = 0;
		this.initflag = true;

		var move = this.el.object3D.rotation;
		move.z = THREE.Math.degToRad(this.random_z);
		this.el.object3D.rotation = move;

		console.log('move dir : ' + this.random_x + "," + this.random_z);
	},

	tick: function (time) {
		this.el.object3D.rotateX(THREE.Math.degToRad(this.random_x));

		// Entry#11. 솔캐릭터 위쪽으로 날아감
		if ( this.initflag ) {
			this.starttime = time;
			this.initflag = false;
		} else {
			// Entry#12. 2초후에 카운트 다운 시작
			if ( time - this.starttime > 2000 ) {
				document.getElementById('countdowntext').style.display = "block";
				this.counter = 5;
				this.intervalId = setInterval(() => {
						this.counter--;
						console.log(this.counter);
						if ( this.counter === 0 ) {	// Entry#13 - UX표시 된 후 게임 시작
							document.getElementById('countdowntext').style.display = "none";
							document.getElementById('count4').style.display = 'none';
							clearInterval(this.intervalId);

							document.getElementById('molymodel').object3D.visible = true;
							document.getElementById('molymodel').setAttribute('moveanywhere','');
							document.getElementById('rinomodel').object3D.visible = true;
							document.getElementById('rinomodel').setAttribute('moveanywhere','');
							document.getElementById('suemodel').object3D.visible = true;
							document.getElementById('suemodel').setAttribute('moveanywhere','');
							document.getElementById('lulamodel').object3D.visible = true;
							document.getElementById('lulamodel').setAttribute('moveanywhere','');
							document.getElementById('doremodel').object3D.visible = true;
							document.getElementById('doremodel').setAttribute('moveanywhere','');
							document.getElementById('solmodel').object3D.visible = true;
							document.getElementById('solmodel').setAttribute('moveanywhere','');

							// 게임 UX 표시
							gameMode = 'gamemode';

							document.getElementById('gameux').style.display = 'block';
							document.getElementById('bow').object3D.visible = true;
						} else
						if ( this.counter === 1 ) {		// Entry#13 - 카운트다운 끝나고 UX표시
							var entity = document.getElementById('startbell');
							entity.components.sound.playSound();        

							document.getElementById('count1').style.display = 'none';
							document.getElementById('count4').style.display = 'flex';
						} else {
							var entity = document.getElementById('countdownsound');
							entity.components.sound.playSound();        

							document.getElementById('count'+this.counter).style.display = 'none';
							document.getElementById('count'+(this.counter-1)).style.display = 'flex';
						}
					}, 1000);

				this.el.object3D.visible = false;
				document.getElementById('solstart').removeAttribute('solstart');
			}
		}	

	}
});

// 초기 시작시에 기본 초기화 처리
function allResetToStart() {
	document.getElementById('solstart').object3D.rotation.set(0,0,0);
	document.getElementById('molystart').object3D.rotation.set(0,0,0);
	document.getElementById('rinostart').object3D.rotation.set(0,0,0);
	document.getElementById('suestart').object3D.rotation.set(0,0,0);
	document.getElementById('lulastart').object3D.rotation.set(0,0,0);
	document.getElementById('dorestart').object3D.rotation.set(0,0,0);

	document.getElementById('molymodel').object3D.visible = false;
	document.getElementById('molymodel').removeAttribute('moveanywhere');
	document.getElementById('rinomodel').object3D.visible = false;
	document.getElementById('rinomodel').removeAttribute('moveanywhere');
	document.getElementById('suemodel').object3D.visible = false;
	document.getElementById('suemodel').removeAttribute('moveanywhere');
	document.getElementById('lulamodel').object3D.visible = false;
	document.getElementById('lulamodel').removeAttribute('moveanywhere');
	document.getElementById('doremodel').object3D.visible = false;
	document.getElementById('doremodel').removeAttribute('moveanywhere');
	document.getElementById('solmodel').object3D.visible = false;
	document.getElementById('solmodel').removeAttribute('moveanywhere');

	document.getElementById('bow').object3D.visible = false;

}

// UX 바뀔때 모든 화살 없애기
function removeAllArrow() {
	let pa = document.getElementById('gun');

	while (pa.firstChild) {
		pa.removeChild(pa.firstChild);
	}
}

    
window.onload = () => {
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

        document.getElementById('molystart').object3D.visible = true;
        document.getElementById('rinostart').object3D.visible = true;
        document.getElementById('suestart').object3D.visible = true;
        document.getElementById('lulastart').object3D.visible = true;
        document.getElementById('dorestart').object3D.visible = true;
        document.getElementById('solstart').object3D.visible = true;

        // 몰리 에니메이션 시작
        document.getElementById('molystart').setAttribute('molystart','');

        var entity = document.getElementById('bgm');
        entity.components.sound.playSound();        
    });

    // 첫번째 UX에서 도움말 버튼 누를때 처리
    document.getElementById('helpbutton').addEventListener('click', function () {
        document.getElementById('firstux').style.display = 'none';
        document.getElementById('helpux').style.display = 'block';
        gameMode = 'titlehelp';		// 타이틀 화면에서 도움말 보기 상태

        var entity = document.getElementById('bgm');
        entity.components.sound.playSound();        
    });

    // 게임중 도움말 화면으로 가기 버튼
    document.getElementById('gamehelpbutton').addEventListener('click', function () {
			document.getElementById('helpux').style.display = 'block';
			document.getElementById('gameux').style.display = 'none';
			removeAllArrow();
			gameMode = 'gamehelp';
		});

    // 메인 화면으로 갈지 물어보는 화면
    document.getElementById('whathomebutton').addEventListener('click', function () {
			document.getElementById('confirmhome').style.display = 'block';
			document.getElementById('gameux').style.display = 'none';
			removeAllArrow();
			gameMode = 'askbackhome';
		});

    // 게임 초기 화면으로 가기
    document.getElementById('tohomeok').addEventListener('click', function () {
			document.getElementById('confirmhome').style.display = 'none';
			document.getElementById('firstux').style.display = 'block';
			removeAllArrow();
			gameMode = 'titlemode';

			allResetToStart();
		});

		// 게임 계속 진행 처리
    document.getElementById('tohomecancel').addEventListener('click', function () {
			document.getElementById('confirmhome').style.display = 'none';
			document.getElementById('gameux').style.display = 'block';
			gameMode = 'gamemode';
		});

		

    // 도움말 ux에서 확인 버튼 누를때 처리
    document.getElementById('helpokbutton').addEventListener('click', function () {
			if ( gameMode === 'titlehelp') {		// 타이틀 화면에서 도움말 보기 상태 처리
					document.getElementById('firstux').style.display = 'block';
					document.getElementById('helpux').style.display = 'none';
					gameMode = 'titlemode';
			} else {	// 게임중 도움말 보기 상태 처리
				document.getElementById('gameux').style.display = 'block';
				document.getElementById('helpux').style.display = 'none';
				gameMode = 'gamemode';
			}
		});

    // 퀴즈 화면에서 O 버튼 누를때 처리
    document.getElementById('obutton').addEventListener('click', function () {
			document.getElementById('quizux').style.display = 'none';

			if ( quizs[quizidx].correct === 0 )	{// O 눌렀을때 0이면 정답
				document.getElementById('quizcorrect').style.display = 'block';
				document.getElementById('resulttext').innerText = quizs[quizidx].result;

				// 정답 소리
				document.getElementById('correctsound').components.sound.playSound();
			} else {
				// 오답 소리
				document.getElementById('wrongsound').components.sound.playSound();

				document.getElementById('quizincorrect').style.display = 'block';
			}
		});

    // 퀴즈 화면에서 X 버튼 누를때 처리
    document.getElementById('xbutton').addEventListener('click', function () {
			document.getElementById('quizux').style.display = 'none';

			if ( quizs[quizidx].correct === 1 )	{// X 눌렀을때 1이면 정답
				document.getElementById('quizcorrect').style.display = 'block';
				document.getElementById('resulttext').innerText = quizs[quizidx].result;
				// 정답 소리
				document.getElementById('correctsound').components.sound.playSound();
			} else {
				// 오답 소리
				document.getElementById('wrongsound').components.sound.playSound();

				document.getElementById('quizincorrect').style.display = 'block';
			}
		});

    // 퀴즈 정답화면에서 OK 버튼 눌러, 다음진행
    document.getElementById('oknext').addEventListener('click', function () {
			document.getElementById('quizcorrect').style.display = 'none';

			quizidx = quizidx + 1;

			if ( quizidx >= 1 )	{ // 모든 퀴즈 맞췄으면...
				document.getElementById('congratux').style.display = 'block';
			} else {	// 아니면 계속 진행
				document.getElementById('gameux').style.display = 'block';
			}

		});

    // 퀴즈 오답화면에서 다시 시도 버튼 눌러, 다시 퀴즈 맞추기 진행 
    document.getElementById('okbefore').addEventListener('click', function () {
			document.getElementById('quizincorrect').style.display = 'none';
			document.getElementById('quizux').style.display = 'block';
		});

    // QR 화면으로 가기
    document.getElementById('gotoqr').addEventListener('click', function () {
			showQR();
		});

    // 게임 초기 화면으로 가기
    document.getElementById('restarthome').addEventListener('click', function () {
			document.getElementById('qrux').style.display = 'none';
			document.getElementById('firstux').style.display = 'block';
			gameMode = 'titlemode';

			allResetToStart();
		});


    // 최초 로딩 완료후 UX표시
    document.querySelector('a-scene').addEventListener('loaded', function () {
        document.getElementById('firstux').style.display = 'block';
    });
};

/*
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
*/

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
/*
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
*/