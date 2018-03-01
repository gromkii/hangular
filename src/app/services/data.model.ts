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
