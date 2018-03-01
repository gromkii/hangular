import {Component, OnDestroy, OnInit} from '@angular/core';
import { DataService } from '../services/data.service';
import { MathHelperService} from '../services/math-helper.service';
import { Subscription } from 'rxjs/Subscription';
import * as THREE from 'three';
import OrbitControls from 'orbit-controls-es6';


@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.css']
})
export class SceneComponent implements OnInit, OnDestroy {
  private nodes: any[];
  private nodeSubscription: Subscription;
  private camera;
  private scene;
  private renderer;
  private controls;

  constructor(
    private dataService: DataService,
    private mathService: MathHelperService
  ) { }

  ngOnInit() {
    this.nodeSubscription = this.dataService.getJson().subscribe( res => {
      this.nodes = res;
      this.nodes = this.meshCreator();
      this.init();
      this.animate();
      this.addMarkersToScene();
    });
  }

  ngOnDestroy() {
    this.nodeSubscription.unsubscribe();
  }

  private meshCreator() {
    const count = this.nodes.length;
    const meshes = [];

    for (let i = 0; i < count; i++) {
      let obj: any = {};
      // Create new mesh using createMarker()
      obj.marker = this.createMarker();

      obj.marker.rotation.y = this.nodes[i].CameraPitch;
      obj.marker.rotation.z = this.nodes[i].CameraYaw;

      // call buildCoordiates to return lat, lng, alt.
      obj = {
        ...obj,
        ...this.buildCoordinates(this.nodes[i])
      };

      // create xyz coordinates based on lat, lng, alt. (ref = 0?)
      obj = {
        ...obj,
        ...this.mathService.topocentric_from_lla(obj.lat, obj.lng, obj.alt, 0, 0, 0)
      };

      meshes.push(obj);
    }

    return meshes;
  }

  private createMarker() {
    const geometry = new THREE.Geometry();

    geometry.vertices = [
      new THREE.Vector3( 0, 0, 0 ),
      new THREE.Vector3( 0, 1, 0 ),
      new THREE.Vector3( 1, 1, 0 ),
      new THREE.Vector3( 1, 0, 0 ),
      new THREE.Vector3( 0.5, 0.5, 1 )
    ];

    geometry.faces = [
      new THREE.Face3( 0, 1, 2 ),
      new THREE.Face3( 0, 2, 3 ),
      new THREE.Face3( 1, 0, 4 ),
      new THREE.Face3( 2, 1, 4 ),
      new THREE.Face3( 3, 2, 4 ),
      new THREE.Face3( 0, 3, 4 )
    ];

    geometry.scaleFactor = .5;

    const material = new THREE.MeshPhongMaterial({color: 0xccee44});
    material.flatShading = true;


    return new THREE.Mesh( geometry, material );
  }

  private buildCoordinates(node) {
    const lat = this.mathService.decimalDegreeConversion(node.GPSLatitude);
    const lng = this.mathService.decimalDegreeConversion(node.GPSLongitude);
    const alt = Number(node.RelativeAltitude.replace('+', ''));

    return {
      lat,
      lng,
      alt
    };
  }

  private init() {

    this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, .01, 10000);

    let avg = this.getAveragePosition();

    this.camera.position.x = avg.x;
    this.camera.position.y = avg.y + 25;
    this.camera.position.z = avg.z - 25;

    this.controls = new OrbitControls(this.camera);

    this.controls.target.set(avg.x, avg.y, avg.z);

    this.controls.autoRotate = true;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer( { antialias: true } );
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );

    this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
    this.scene.fog = new THREE.Fog( this.scene.background, 1, 5000 );

    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );

    this.scene.add( hemiLight );

    const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    this.scene.add( hemiLightHelper );

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( -1, 1.75, 1 );
    dirLight.position.multiplyScalar( 30 );
    this.scene.add( dirLight );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;
    const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 )
    this.scene.add( dirLightHeper );


  }

  private animate() {

    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
  }

  private getAveragePosition() {
    let x = 0, y = 0, z = 0;

    this.nodes.map(mesh => {
      x += mesh.x;
      y += mesh.y;
      z += mesh.z;
    });

    x /= this.nodes.length;
    y /= this.nodes.length;
    z /= this.nodes.length;

    return {
      x, y, z
    };
  }

  private addMarkersToScene(): void {
    this.nodes.map(mesh => {
      this.scene.add(mesh.marker);
      mesh.marker.position.set(mesh.x, mesh.y, mesh.z);
    });
  }
}
