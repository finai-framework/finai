"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const fs = tslib_1.__importStar(require("fs"));
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
let AssetService = class AssetService {
    constructor( /* Add @inject to inject parameters */) {
        this.assetsPath = path.join(__dirname, '../../assets');
    }
    async getImageToday() {
        try {
            const files = fs.readdirSync(this.assetsPath);
            const images = files.filter(file => /\.(jpg|jpeg|png|gif|svg)$/.test(file.toLowerCase()));
            const filteredImages = images.filter(file => {
                let fileName = file.replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
                const regex = /^"([^"]+)" (\d{4}-\d{2}-\d{2})(?: (done))?$/i;
                const match = fileName.match(regex);
                const date = new Date();
                if (!match)
                    return false;
                const stringDate = match[2];
                const isToday = date.toISOString().slice(0, 10) === stringDate;
                return !match[3] && isToday;
            });
            if (filteredImages.length === 0) {
                return null;
            }
            // Lấy file đầu tiên thỏa mãn (hoặc bạn có thể thay đổi logic chọn file)
            const selectedFile = filteredImages[0];
            let fileName = selectedFile.replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
            const match = fileName.match(/^"([^"]+)" (\d{4}-\d{2}-\d{2})(?: (done))?$/i);
            if (!match) {
                return null;
            }
            const topic = match[1];
            const filepath = path.join(this.assetsPath, selectedFile);
            return { topic, filepath };
        }
        catch (error) {
            return null;
        }
    }
    async changeDoneImage(filepath) {
        const fileName = path.basename(filepath).replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
        await fs_1.promises.rename(filepath, this.assetsPath + "/" + fileName + " done" + ".jpg");
    }
};
exports.AssetService = AssetService;
exports.AssetService = AssetService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], AssetService);
//# sourceMappingURL=asset.service.js.map