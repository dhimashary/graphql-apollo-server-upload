import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import imagekit from '../helpers/imageUpload.mjs';
import stream2buffer from '../helpers/streamToBuffer.mjs';

export const typeDefs = `#graphql
  scalar Upload
  
  type Image {
    filename: String!
  }

  type UploadMessage {
    msg: String
  }

  type Query {
    images: [Image!]
  }
  
  type Mutation {
    uploadImages(images: [Upload!]!): UploadMessage
  }
`;


export const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    images: () => images,
  },
  Mutation: {
    uploadImages: async (_, { images }) => {
      try {

        const result = await Promise.all(images);
        console.log(result, "-=-=-=");
        const imagesBufferPromises = result.map(img => {
          const stream = img.createReadStream();
          return stream2buffer(stream);
        });
        const imagesBuffer = await Promise.all(imagesBufferPromises);

        // sesuaikan upload dengan third party yg dipakai, karena imagekit hanya bisa upload satu file dalam satu waktu maka diambil dari index 0 saja
        const data = await imagekit.upload({
          file: imagesBuffer[0],
          fileName: result[0].filename
        });

        console.log(data, "uploaded");

        // console.log(data);
        // simpan data2 yg dibutuhkan seperti filename, url ke database kalian

        return {
          msg: "Upload success"
        };
      } catch (error) {
        throw error;
      }

    },
  },
};
