import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryResponse } from "src/helpers/interface";

@Injectable()
export class CloudinaryService {
    constructor() {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });
    }

    async uploadFileToCloudinary(files: Express.Multer.File[]) {
        try {
            const uploadPromises = files.map(
                (file) =>
                    new Promise((resolve, reject) => {
                        cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
                            {
                                resource_type: "auto",
                                public_id: `${Date.now()}_${file.originalname}`,
                                transformation: [
                                    { width: 1000, crop: "scale" },
                                    { quality: "auto" },
                                    { fetch_format: "auto" },
                                ],
                            },
                            (error, result) => {
                                if (error) return reject(error);
                                resolve(result);
                            }
                        );
                    })
            );

            const results = await Promise.all(uploadPromises);

            return results.map((result: CloudinaryResponse) => ({
                public_id: result.public_id,
                url: result.secure_url,
            }));
        } catch (error) {
            throw new Error(`Error uploading files to Cloudinary: ${error.message}`);
        }
    }

    async deleteFileFromCloudinary(publicId: string) {
        try {
            return await new Promise((resolve, reject) => {
                cloudinary.uploader.destroy(publicId.trim(), (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
            });
        } catch (error) {
            throw new Error(`Error deleting file from Cloudinary: ${error.message}`);
        }
    }
}
