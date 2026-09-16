import { apiClient } from "../../../core/api/apiClient";
import type { ApiResponse } from "../../../core/api/apiResponse";
import type { SignUploadParams, UploadedMedia } from "../models/media.model";
import type { IMediaRepository } from "./media.repository";
import axios from "axios";

export class MediaApiRepository implements IMediaRepository {
    
    /**
     * Lấy các tham số chữ ký để chuẩn bị cho direct upload lên Cloudinary.
     * GET /media/sign?folder={folder}
     */
    async getSignedUploadParams(folder: string = 'products'): Promise<ApiResponse<SignUploadParams>> {
        return apiClient.get<ApiResponse<SignUploadParams>>(`/media/sign?folder=${folder}`);
    }

    /**
     * Upload trực tiếp file lên Cloudinary thông qua URL và chữ ký.
     */
    async uploadToCloudinary(file: File, params: SignUploadParams): Promise<UploadedMedia> {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", params.apiKey);
        formData.append("signature", params.signature);
        formData.append("timestamp", params.timestamp.toString());
        formData.append("folder", params.folder);
        // Bắt buộc phải gắn tag 'tmp' giống hệt như BE đã ký.
        formData.append("tags", params.tags);

        // Sử dụng axios trực tiếp để không bị dính các interceptor (như gắn Authorization token)
        // của apiClient, tránh lỗi xác thực với Cloudinary.
        const response = await axios.post(params.uploadUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        // Cloudinary trả về theo định dạng của họ
        return {
            publicId: response.data.public_id,
            url: response.data.secure_url,
            format: response.data.format,
            bytes: response.data.bytes
        };
    }
}
