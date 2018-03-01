import { Mesh } from 'three';

export class MeshNode {
  constructor(
    public lat: number,
    public lng: number,
    public alt: number,
    public x: number,
    public y: number,
    public z: number,
    public marker: Mesh
  ) { }
}
