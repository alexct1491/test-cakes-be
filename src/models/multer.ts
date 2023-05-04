export type DestinationCallback = (error: Error | null, destination: string) => void;
export type FileNameCallback = (error: Error | null, filename: string) => void;
export type ImageFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
};

