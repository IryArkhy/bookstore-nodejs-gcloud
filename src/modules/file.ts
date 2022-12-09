import DatauriParser from 'datauri/parser';

const parser = new DatauriParser();

export const bufferToDataURI = (fileFormat, buffer) =>
  parser.format(fileFormat, buffer);
