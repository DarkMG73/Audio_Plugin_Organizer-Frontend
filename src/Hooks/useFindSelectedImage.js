import { useSelector } from "react-redux";
// import { AdvancedImage } from '@cloudinary/react';
// import { Cloudinary } from '@cloudinary/url-gen';

const useFindSelectedImage = () => {
   const { officialImages, defaultImages } = useSelector(
      (state) => state.toolsData
   );

   const findSelectedImage = (imageSelected) => {
      let imageSelectedURL = false;

      // officialImages.forEach((group) => {
      //   if (group.name.split('/').pop() === imageSelected.split('/').pop())
      //     officialImageSelected =
      //       'https://res.cloudinary.com/do0dxcsdm/image/upload/v1739314331/' +
      //       group.src.replace('official_plugin_images/');
      // });

      // const myCld = new Cloudinary({
      //   cloud: {
      //     cloudName: 'do0dxcsdm',
      //   },
      // });

      // myCld.v2.resources(
      //   {
      //     type: 'upload',
      //     prefix: 'OEM_Images', // add your folder
      //   },
      //   function (error, result) {
      //     console.log('RESULT ---------->', result, error);
      //   },
      // );

      // let img = myCld.image('sample');

      // Check if a default image was selected.
      if (imageSelected && imageSelected.includes("generic_plugin_images")) {
         const functionCategory = imageSelected.substring(
            imageSelected.indexOf("/") + 1,
            imageSelected.lastIndexOf("/")
         );

         defaultImages[functionCategory].forEach((group) => {
            if (group.name.split("/").pop() === imageSelected.split("/").pop())
               imageSelectedURL = group.src;
         });
      } else if (
         officialImages[
            imageSelected
               .split("/")
               .pop()
               .replace("official_plugin_images/")
               .replace(/\.[^/.]+$/, "")
         ]
      ) {
         const img =
            officialImages[
               imageSelected
                  .split("/")
                  .pop()
                  .replace("official_plugin_images/")
                  .replace(/\.[^/.]+$/, "")
            ]?.src;

         imageSelectedURL = img;
      }

      // 'https://res.cloudinary.com/do0dxcsdm/image/upload/v1739333372/' +
      // imageSelected.split('/').pop().replace('official_plugin_images/');

      // const defaultlImageSelected =
      //   defaultImages[
      //     `${imageSelected.replace('generic_plugin_images', '')}`
      //   ];

      return imageSelectedURL;
   };

   return findSelectedImage;
};

export default useFindSelectedImage;
