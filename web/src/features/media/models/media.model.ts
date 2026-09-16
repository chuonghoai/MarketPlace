export interface SignUploadParams {
    uploadUrl: string;
    apiKey: string;
    cloudName: string;
    signature: string;
    timestamp: number;
    folder: string;
    tags: string;
}

export interface UploadedMedia {
    publicId: string;
    url: string;
    format?: string;
    bytes?: number;
}
