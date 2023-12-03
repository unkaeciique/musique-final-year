import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

import firebase from "firebase/compat/app";
import { v4 as uuid } from "uuid";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDzHdE9rkSMxEa-0SZvgQaYVKmLDL5e83w",
  authDomain: "musique-e0769.firebaseapp.com",
  projectId: "musique-e0769",
  storageBucket: "musique-e0769.appspot.com",
  messagingSenderId: "164758159918",
  appId: "1:164758159918:web:7d2f859a045a55251595bf",
  measurementId: "G-6FF2NKZYS7",
});

// Use these for db & auth
// console.log("api key = ", import.meta.env);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
/**
 *
 * @param {File[]} files
 * @param {{
 *   storageLocation: string,
 *   onUploadProgress: (percentage: number) => void
 * }} options
 */

function handleMultiUpload(files, options = {}) {
  const _options = Object.assign(
    {
      storageLocation: "images",
      /**
       *
       * @param {number} _percentage
       */
      onUploadProgress: (_percentage) => {},
      generateThumbnails: false,
    },
    options,
  );

  let totalSize = 0;
  let totalUploaded = 0;

  const uploadPromises = files.map((file) => {
    const fileName = uuid() + "." + file.name.split(".").pop();
    return new Promise((resolve, reject) => {
      const task = storage
        .ref(`${_options.storageLocation}/${fileName}`)
        .put(file);

      /** @type {null|number} */
      let currUploadTotalSize = null;
      /** @type {null|number} */
      let lastUploadedSize = null;

      task.on(
        "state_changed",
        (snapshot) => {
          if (currUploadTotalSize === null) {
            totalSize += snapshot.totalBytes;
            currUploadTotalSize = snapshot.totalBytes;
          }

          totalUploaded -= lastUploadedSize ?? 0;
          totalUploaded += snapshot.bytesTransferred;

          lastUploadedSize = snapshot.bytesTransferred;

          _options.onUploadProgress(
            Math.round((totalUploaded / totalSize) * 100),
          );
        },
        (error) => {
          if (currUploadTotalSize !== null) {
            totalSize -= currUploadTotalSize;
          }

          if (lastUploadedSize !== null) {
            totalUploaded -= lastUploadedSize;
          }

          reject(error);
        },
        () => {
          storage
            .ref(_options.storageLocation)
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              if (_options.generateThumbnails) {
                const thumbnailScale = 1 / 10;

                const image = new Image();
                image.src = URL.createObjectURL(file);

                image.addEventListener("load", () => {
                  const canvas = document.createElement("canvas");
                  canvas.width = image.naturalWidth * thumbnailScale;
                  canvas.height = image.naturalHeight * thumbnailScale;

                  canvas
                    .getContext("2d")
                    .drawImage(image, 0, 0, canvas.width, canvas.height);

                  resolve({
                    thumbnail: canvas.toDataURL(),
                    imageWidth: image.naturalWidth,
                    imageHeight: image.naturalHeight,
                    imageUrl: url,
                  });
                });

                image.addEventListener("error", () => {
                  resolve({
                    imageUrl: url,
                    thumbnail: null,
                    imageWidth: 0,
                    imageHeight: 0,
                  });
                });
              } else {
                resolve(url);
              }
            })
            .catch((error) => {
              reject(error);
            });
        },
      );
    });
  });

  return new Promise((resolve, reject) => {
    Promise.all(uploadPromises)
      .then((uploads) => {
        resolve(uploads);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export { db, auth, storage, handleMultiUpload };
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
