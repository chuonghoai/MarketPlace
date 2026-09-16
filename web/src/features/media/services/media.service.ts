import type { IMediaRepository } from "../repositories/media.repository";
import { MediaApiRepository } from "../repositories/mediaApi.repository";
import type { UploadedMedia } from "../models/media.model";

export class MediaService {
    private readonly mediaRepository: IMediaRepository;

    constructor(mediaRepository?: IMediaRepository) {
        // Mặc định luôn dùng ApiRepository theo cấu trúc mới
        this.mediaRepository = mediaRepository || new MediaApiRepository();
    }

    /**
     * Xử lý upload danh sách các files.
     * 1. Lấy thông tin chữ ký từ Backend.
     * 2. Gọi upload trực tiếp từng file lên Cloudinary.
     */
    async uploadMultipleFiles(files: File[], folder: string = 'products'): Promise<UploadedMedia[] | null> {
        if (!files || files.length === 0) return [];

        try {
            // Bước 1: Lấy tham số có chữ ký từ server
            const signResponse = await this.mediaRepository.getSignedUploadParams(folder);
            if (!signResponse.success || !signResponse.data) {
                console.error("Lỗi khi lấy thông tin chữ ký upload:", signResponse.message);
                return null;
            }

            const signParams = signResponse.data;
            const uploadPromises = files.map(file => 
                this.mediaRepository.uploadToCloudinary(file, signParams)
            );

            // Bước 2: Upload song song lên Cloudinary
            const results = await Promise.all(uploadPromises);
            return results;
        } catch (error) {
            console.error("Lỗi upload Cloudinary trực tiếp:", error);
            return null;
        }
    }
}

export const mediaService = new MediaService();
