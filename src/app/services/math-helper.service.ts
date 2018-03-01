import { Injectable } from '@angular/core';
import { glMatrix, mat4 } from 'gl-matrix';
import { MeshNode } from '../scene/meshNode.model';

@Injectable()
export class MathHelperService {
  private WGS84_a = 6378137.0; // 6378137.0
  private WGS84_b = 6356752.314245; // 6356752.314245

  constructor() { }

  public ecef_from_lla(lat, lon, alt) {

    let a2 = Math.pow(this.WGS84_a, 2);
    let b2 = Math.pow(this.WGS84_b, 2);
    let lat1 = this.degreeToRadian(lat);
    let lon1 = this.degreeToRadian(lon);
    let L = 1.0 / Math.sqrt(a2 * Math.pow(Math.cos(lat1), 2) + b2 * Math.pow(Math.sin(lat1), 2));
    let x = (a2 * L + alt) * Math.cos(lat1) * Math.cos(lon1);
    let y = (a2 * L + alt) * Math.cos(lat1) * Math.sin(lon1);
    let z = (b2 * L + alt) * Math.sin(lat1);
    return {
      x: x,
      y: y,
      z: z
    };

  }

  public ecef_from_topocentric_transform(lat, lon, alt) {

    let xyz = this.ecef_from_lla(lat, lon, alt);
    let sa = Math.sin(this.degreeToRadian(lat));
    let ca = Math.cos(this.degreeToRadian(lat));
    let so = Math.sin(this.degreeToRadian(lon));
    let co = Math.cos(this.degreeToRadian(lon));

    return [- so, - sa * co, ca * co, xyz.x,
      co, - sa * so, ca * so, xyz.y,
      0,        ca,      sa, xyz.z,
      0,         0,       0, 1];
  }

  public topocentric_from_lla(lat, lon, alt, reflat, reflon, refalt) {

    let matrix = new Array(16);
    mat4.invert(matrix, this.ecef_from_topocentric_transform(reflat, reflon, refalt));

    let xyz = this.ecef_from_lla(lat, lon, alt);
    let tx = matrix[0] * xyz.x + matrix[1] * xyz.y + matrix[2] *  xyz.z + matrix[3];
    let ty = matrix[4] * xyz.x + matrix[5] * xyz.y + matrix[6] *  xyz.z + matrix[7];
    let tz = matrix[8] * xyz.x + matrix[9] * xyz.y + matrix[10] * xyz.z + matrix[11];
    return {
      x: tx,
      y: ty,
      z: tz
    };
  }

  public degreeToRadian(degree) {
    return glMatrix.toRadian(degree);
  }

  public  decimalDegreeConversion(nodeString): number {
    // parse nodeString (GPSLat/GPSLng)
    const node = nodeString.split(/[^0-9.A-Z]/g).filter((node) => node !== '');

    // convert parsed + split array of strings into decimal degrees.
    let decimalDegree = (Number(node[0]) + (Number(node[1]) / 60) + (Number(node[2]) / 3600));

    // Account for Equator and 45th Parallel, not sure how necesary it is here.
    switch(node[3]) {
      case 'S':
      case 'W':
        decimalDegree *= -1;
        break;

      default:
        break;
    }

    return decimalDegree;
  }

  public getAveragePosition(meshes: MeshNode[]): any {
    let x = 0, y = 0, z = 0;

    meshes.map(mesh => {
      x += mesh.x;
      y += mesh.y;
      z += mesh.z;
    });

    x /= meshes.length;
    y /= meshes.length;
    z /= meshes.length;

    return {
      x, y, z
    };
  }

}
