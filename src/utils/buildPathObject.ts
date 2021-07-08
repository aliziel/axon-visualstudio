import FindEndpointData from './utilityFunctions/FindEndpointData';
import IdentifyFileType from './utilityFunctions/IdentifyFileType';

/**
 * When a server folder is uploaded, it is converted to a 'flat' array-like FileList object.
 * This function is designed to build a new object, where individual file path names  
 * will be the keys to the new object. And the values will be a newly formatted file object. 
 * This object is being built so that all files can be accessed in constant time, via their paths.
 * @param {FileList} fileList - This will be the FileList object that is built from the uploaded server folder 
*/
export default function (fileList:ReadResult[]) {
  // Initialize the returned object
  const pathObject = {} as PathObject;
  // Traverse through the fileList input
  for (let i = 0; i < fileList.length; i++) {
    // Name text for easier reference
    const fileText = fileList[i].text;
    const { fileType, portNumber } = IdentifyFileType(fileText);

    // When the type of file is a server, add the server path to the pathObject
    if (fileType === 'Server') {
      pathObject.__serverFilePath__ = fileList[i].name;
      pathObject.__portNumber__ = portNumber;
    }

    // Create a new File Object based on the file type
    let newFileObject:FileObject;
    // When the file is a server or router file
    if (fileType === 'Server' || fileType === 'Router') {
      // Extract necessary route and endpoint data from fileText
      const { imports, endpoints, routers } = FindEndpointData(fileText, fileList[i].name);
      // Add relevant data to the new file object
      newFileObject = {
        name: fileList[i].name,
        imports,
        endpoints,
        routers,
      };
      // When the file is neither a server nor router file
    } else {
      newFileObject = fileList[i];
    }

    // Add the newly created file object to the pathObject
    pathObject[fileList[i].name] = newFileObject;
  };

  return pathObject;
};
