/* global AFRAME, THREE, Ammo */
"use strict";

const tempQuaternion = new THREE.Quaternion();
const tempVector = new THREE.Vector3();
const upVector = new THREE.Vector3(0,1,0);

AFRAME.registerComponent('ammo-restitution', {
  schema: { default: 0.5 },
  init() {
    const el = this.el;
    const restitution = this.data;
    el.addEventListener('body-loaded', function () {
      el.body.setRestitution(restitution);
    });
  }
});
  
function positionAmmoBody(body, p) {
  const transform = new Ammo.btTransform();
  body.getMotionState().getWorldTransform(transform);

  const positionVec = new Ammo.btVector3(p.x, p.y, p.z);

  transform.setOrigin(positionVec);
  body.getMotionState().setWorldTransform(transform);
  body.setCenterOfMassTransform(transform);
  body.activate();

  // Clean up
  Ammo.destroy(transform);
  Ammo.destroy(positionVec);
}

AFRAME.registerComponent('basketball-game', {
  schema: {
    mode: {
      default: 'positioning',
      oneOf: ['positioning', 'playing']
    },
    ball: {
      default: '#ball',
      type: 'selector'
    },
    hoop: {
      default: '#hoop',
      type: 'selector'
    },
    message: {
      default: '#message',
      type: 'selector'
    },
    controls: {
      default: '#controls',
      type: 'selector'
    },
    launchVelocity: {
      default: 5
    }
  },
  update (data) {
    this.needsUpdate = true;
  },
  init () {
    // If the user taps on any buttons or interactive elements we may add then prevent
    // Any WebXR select events from firing
    this.data.controls.addEventListener("beforexrselect", e => {
      e.preventDefault();
    });
    
    this.onEnterXR = this.onEnterXR.bind(this);
    this.onExitXR = this.onExitXR.bind(this);
    this.onSelectEnd = this.onSelectEnd.bind(this);
    this.onSelectStart = this.onSelectStart.bind(this);
    this.onARHitTestSelect = this.onARHitTestSelect.bind(this);
    
    this.el.addEventListener("enter-vr", this.onEnterXR);
    this.el.addEventListener("exit-vr", this.onExitXR);
  },
  update (oldData) {
    if (!this.button) {
      this.button = document.createElement('button');
      this.data.controls.appendChild(this.button);
      this.hasMadeControls = true;
      this.button.addEventListener('click', () => {
        switch (this.data.mode) {
          case 'positioning':
            this.el.setAttribute('basketball-game', 'mode', 'playing');
            break;
          case 'playing':
            this.el.setAttribute('basketball-game', 'mode', 'positioning');
            break;
        }
      });
    }

switch (this.data.mode) {
  case 'positioning':
    this.button.textContent = 'Shoot some hoops!';
    if (this.el.is("ar-mode")) {
      this.data.message.innerHTML = `Select the location to place<br />By tapping on the screen or selecting with your controller.`;
    }
    this.el.setAttribute('ar-hit-test', 'enabled', true);
    break;
  case 'playing':
    this.button.textContent = 'Move the hoop';
    this.data.message.textContent = "Start play!";
    this.el.setAttribute('ar-hit-test', 'enabled', false);
    break;
}
  },
  onEnterXR() {
    this.el.xrSession.addEventListener("selectend", this.onSelectEnd);
    this.el.xrSession.addEventListener("selectstart", this.onSelectStart);

    if (!this.el.is("ar-mode")) {
      this.el.setAttribute('basketball-game', 'mode', 'playing');
    } else {
      // Entered AR
      this.data.message.textContent = "";

      // Hit testing is available
      this.el.addEventListener( "ar-hit-test-start", function() {
        this.data.message.innerHTML = `Scanning environment, finding surface.`;
      }.bind(this), { once: true });

      // Has managed to start doing hit testing
      this.el.addEventListener( "ar-hit-test-achieved", function() {
        this.data.message.innerHTML = `Select the location to place<br />By tapping on the screen or selecting with your controller.`;
      }.bind(this), { once: true } );

      // User has placed an object
      this.el.addEventListener( "ar-hit-test-select", this.onARHitTestSelect );
    }
  },
  onExitXR () {
    this.data.message.textContent = "Exited Immersive Mode";
  },
  
  /*
    After the hoop is placed with ar-hit-test this will rotate it so that it
    is upright and then it sets the mode to be playing which disables ar-hit-test
  */
  onARHitTestSelect (e) {
    if (this.data.mode === 'positioning') {
      tempVector.set(0, 0, -1);
      this.data.hoop.object3D.quaternion.copy(e.detail.orientation);
      tempVector.applyQuaternion(this.data.hoop.object3D.quaternion);
      tempQuaternion.setFromUnitVectors(tempVector, upVector);
      this.data.hoop.object3D.position.copy(e.detail.position);
      this.data.hoop.object3D.quaternion.premultiply(tempQuaternion);
      
      this.el.setAttribute('basketball-game', 'mode', 'playing');
    }
  },
  /*
    If the user is playing then launch the ball
  */
  onSelectEnd(e) {
    this.inputSource = null;
    if (this.data.mode === 'playing') {
      const frame = e.frame;
      const inputSource = e.inputSource;
      const referenceSpace = this.el.renderer.xr.getReferenceSpace();
      const pose = frame.getPose(inputSource.targetRaySpace, referenceSpace);

      positionAmmoBody(this.data.ball.body, pose.transform.position);
      
      tempVector.set(0, 0, -1 * this.data.launchVelocity);
      tempVector.applyQuaternion(pose.transform.orientation);
      const velocity = new Ammo.btVector3(tempVector.x, tempVector.y, tempVector.z);
      this.data.ball.body.setLinearVelocity(velocity);
      
      this.data.ball.body.activate();

      Ammo.destroy(velocity);
    }
  },
  onSelectStart(e) {
    this.inputSource = e.inputSource;
  },
  tick () {
    if (this.data.mode === 'playing' && this.inputSource) {
    const inputSource = this.inputSource;
    const sceneEl = this.el;
    const frame = sceneEl.frame;
    const refSpace = sceneEl.renderer.xr.getReferenceSpace();
    const pointerPose = frame.getPose(
      inputSource.targetRaySpace,
      refSpace
    );
      const transform = pointerPose.transform;
      positionAmmoBody(this.data.ball.body, transform.position);
      const velocity = new Ammo.btVector3(0,0,0);
      this.data.ball.body.setLinearVelocity(velocity);
      this.data.ball.body.setActivationState(0);
      Ammo.destroy(velocity);
    }
  }
});
