export declare class AssetService {
    private assetsPath;
    constructor();
    getImageToday(): Promise<{
        topic: string;
        filepath: string;
    } | null>;
    changeDoneImage(filepath: string): Promise<void>;
}
