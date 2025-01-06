import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import * as fs from 'fs';
import {promises as fileRename} from 'fs';

import * as path from 'path';

@injectable({scope: BindingScope.TRANSIENT})
export class AssetService {
  private assetsPath: string;

  constructor(/* Add @inject to inject parameters */) {
    this.assetsPath = path.join(__dirname, '../../assets');
  }



  async getImageToday(): Promise<{
    topic: string;
    filepath: string;
  } | null> {
    try {
      const files = fs.readdirSync(this.assetsPath);
      const images = files.filter(file =>
        /\.(jpg|jpeg|png|gif|svg)$/.test(file.toLowerCase()), // Lọc file định dạng ảnh
      );

      const filteredImages = images.filter(file => {
        let fileName = file.replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
        const regex = /^"([^"]+)" (\d{4}-\d{2}-\d{2})(?: (done))?$/i;
        const match = fileName.match(regex);
        const date = new Date();
        if (!match) return false;
        const stringDate = match![2];
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

      return {topic, filepath};
    } catch (error) {
      return null;
    }
  }

  public async changeDoneImage(
    filepath: string,
  ) {
    const fileName = path.basename(filepath).replace(/\.(jpg|jpeg|png|gif|svg)$/i, '');
    await fileRename.rename(filepath, this.assetsPath + "/" + fileName + " done" + ".jpg");
  }
}
