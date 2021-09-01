import {FileRejection} from "react-dropzone";
import _ from "lodash";

export const dataURItoBlob = (dataURI: string): Blob => {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(",")[1]);

  // separate out the mime component
  const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  const ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  return new Blob([ab], {type: mimeString});
};

export const dataURItoFile = (dataURI: string, fileName: string, fileType: string): File => {
  return new File([dataURItoBlob(dataURI)], fileName, {
    type: fileType,
    lastModified: new Date().getTime(),
  });
};

export const getFilesRejectedMessageKey = (fileRejections?: FileRejection | FileRejection[]): string => {
  if (!fileRejections) {
    return "error.invalid-file-upload";
  }

  if (_.isArray(fileRejections) && _.isEmpty(fileRejections)) {
    return "error.invalid-file-upload";
  }

  const fileRejection: FileRejection = _.isArray(fileRejections) ? fileRejections[0] : fileRejections;
  const {errors} = fileRejection;

  if (!!errors?.length) {
    const error = errors[0];
    const {code} = error;

    switch (code) {
      case "file-too-large":
        return "error.invalid-file-upload-too-large";
      case "file-too-small":
        return "error.invalid-file-upload-too-small";
      case "too-many-files":
        return "error.invalid-file-upload-too-many-files";
      case "file-invalid-type":
        return "error.invalid-file-upload-invalid-type";
      default:
        return "error.invalid-file-upload";
    }
  }

  return "error.invalid-file-upload";
};

export const getFileSizeString = (fileSize?: number): string => {
  return `${Math.ceil((fileSize || 0) / 1000)}KB`;
};
