const Storage = require('@google-cloud/storage');
const projectId = 'csc510-bot';

// Creates a client
var config = {
    projectId: projectId,
    keyFilename: `${process.env.KEYFILE}`
  };  
const storage = require('@google-cloud/storage')(config);

module.exports =
{
    
    // Lists files in the bucket
    listFiles: function(bucketName, callback){
        console.log(`***    Listing file in bucket ${bucketName}.  ***`);
        storage.bucket(bucketName).getFiles().then(results => {
            const files = results[0];
            console.log('Files:');
            files.forEach(file => {
                console.log(file.name);
            });
            callback(true);
        }).catch(err => {
            console.error('ERROR in listFiles:', err);
            callback(false);
        })  
    },

    // Uploads a local file to the bucket
    uploadFile: function (bucketName, filename, callback) {
        console.log(`***    Uploading file ${filename} in bucket ${bucketName}.  ***`);
        storage.bucket(bucketName).upload(filename).then(() => {
            console.log(`${filename} uploaded to ${bucketName}.`);
            callback(true);
        }).catch(err => {
            console.error('ERROR in uploadFile:', err);
            callback(false);
        });
    },
    
    // Deletes a file from the bucket
    deleteFile: function (bucketName, filename, callback) {
        console.log(`***    Deleting file ${filename} in bucket ${bucketName}.  ***`);
        storage.bucket(bucketName).file(filename).delete().then(() => {
            console.log(`gs://${bucketName}/${filename} deleted.`);
            callback(true);
        }).catch(err => {
            console.error('ERROR in deleteFile:', err);
            callback(false);
        });
    },

    // Makes the file public
    makePublic: function (bucketName, filename, callback) {
        console.log(`***   Converting ${filename} in bucket ${bucketName} from private to public.  ***`);   
        storage.bucket(bucketName).file(filename).makePublic().then(() => {
            console.log(`gs://${bucketName}/${filename} is now public.`);
            console.log(`You can find it here: https://storage.googleapis.com/csc510-bot/${filename}`);
            callback(true);
        }).catch(err => {
            console.error('ERROR in makePublic:', err);
            callback(false);
        });
    },

    // Gets the metadata for the file
    getMetadata: function (bucketName, filename, callback) {
        console.log(`***    Getting metadata of file ${filename} in bucket ${bucketName}.  ***`);
        storage.bucket(bucketName).file(filename).getMetadata().then(results => {
            const metadata = results[0];

            console.log(`File: ${metadata.name}`);
            console.log(`Bucket: ${metadata.bucket}`);
            console.log(`Storage class: ${metadata.storageClass}`);
            console.log(`Self link: ${metadata.selfLink}`);
            console.log(`ID: ${metadata.id}`);
            console.log(`Size: ${metadata.size}`);
            console.log(`Updated: ${metadata.updated}`);
            console.log(`Generation: ${metadata.generation}`);
            console.log(`Metageneration: ${metadata.metageneration}`);
            console.log(`Etag: ${metadata.etag}`);
            console.log(`Owner: ${metadata.owner}`);
            console.log(`Component count: ${metadata.component_count}`);
            console.log(`Crc32c: ${metadata.crc32c}`);
            console.log(`md5Hash: ${metadata.md5Hash}`);
            console.log(`Cache-control: ${metadata.cacheControl}`);
            console.log(`Content-type: ${metadata.contentType}`);
            console.log(`Content-disposition: ${metadata.contentDisposition}`);
            console.log(`Content-encoding: ${metadata.contentEncoding}`);
            console.log(`Content-language: ${metadata.contentLanguage}`);
            console.log(`Metadata: ${metadata.metadata}`);
            console.log(`Media link: ${metadata.mediaLink}`);
            callback(true);
        }).catch(err => {
            console.error('ERROR in getMetadata:', err);
            callback(false);
        });
    }

}