import type { ApiResponse } from "../../../core/api/apiResponse";
import type { SignUploadParams, UploadedMedia } from "../models/media.model";

export interface IMediaRepository {
    getSignedUploadParams(folder?: string): Promise<ApiResponse<SignUploadParams>>;
    uploadToCloudinary(file: File, params: SignUploadParams): Promise<UploadedMedia>;
}
