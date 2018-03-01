export class MetaData {
  constructor (
    public SourceFile: string,
    public GPSLatitude: string,
    public GPSLongitude: string,
    public FileName: string,
    public CameraPitch: Number,
    public CameraRoll: string,
    public CameraYaw: Number,
    public RelativeAltitude: string
  ) {}
}

/*
"SourceFile": "/Users/dax/Downloads/34 Columns -45 angle/DJI_0522.JPG",
  "GPSLatitude": "30 deg 22' 47.06\" N",
  "GPSLongitude": "97 deg 45' 55.29\" W",
  "GPSAltitude": "354.4 m Above Sea Level",
  "FileName": "DJI_0522.JPG",
  "CameraPitch": -45.10,
  "CameraRoll": "+0.00",
  "CameraYaw": -117.00,
  "RelativeAltitude": "+29.90"
 */
