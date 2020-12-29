const fs = require('mz/fs');
const path = require('path');
const request = require('request');
const slog = require('single-line-log').stdout;

export default {
    // 创建hash值
    createHash(hashLength = 24) {
        // 默认长度 24
        return Array.from(Array(Number(hashLength)), () => Math.floor(Math.random() * 36).toString(36)).join('');
    },
    // 递归删除文件
    async removeFile(path) {
        if (!path) return;
        const files = fs.readdirSync(path);
        for (let i = 0; i < files.length; i++) {
            const pathf = `${path}/${files[i]}`;// 拼接子文件路径
            const stats = fs.statSync(pathf);
            if (stats.isFile()) {
                await fs.unlinkSync(pathf); // 若为文件则删除
            } else {
                this.removeFile(pathf);
            }
        }
        await fs.rmdirSync(path);
    },
    async moveFile(oldPath, newPath) {
        return new Promise((resolve, reject) => {
            fs.rename(oldPath, newPath, function(err) {
                if (err) {
                    if (err.code === 'EXDEV') {
                        copy();
                    } else {
                        reject(err);
                    }
                    return;
                }
                resolve(true);
            });

            function copy() {
                const readStream = fs.createReadStream(oldPath);
                const writeStream = fs.createWriteStream(newPath);

                readStream.on('error', () => {
                    reject(new Error('读取错误'));
                });
                writeStream.on('error', () => {
                    reject(new Error('读取错误'));
                });

                readStream.on('close', function() {
                    fs.unlink(oldPath, () => {
                        resolve(true);
                    });
                });

                readStream.pipe(writeStream);
            }
        });
    },
    // 下载文件
    async downloadFile(patchUrl, baseDir, downloadFile) {
        return new Promise((resolve, reject) => {
            const req = request({
                method: 'GET',
                uri: patchUrl,
            });

            let receivedBytes: number = 0;
            let totalBytes: number = 0;

            const out = fs.createWriteStream(path.join(baseDir, downloadFile));
            req.pipe(out);

            req.on('response', data => {
                // 更新总文件字节大小
                totalBytes = parseInt(data.headers['content-length'], 10);
            });
            req.on('data', chunk => {
                // 更新下载的文件块字节大小
                receivedBytes += chunk.length;
                const prog: string = ((receivedBytes / totalBytes) * 100).toString();
                const number: number = Number.parseInt(prog);
                slog(`当前下载进度 ${number} %`);
            });

            req.on('end', () => {
                resolve(true);
                slog('下载已完成，等待处理');
            });
            req.on('error', err => {
                reject(err);
            });
        });
    },
    isFileExist(file) {
        return new Promise(resolve => {
            fs.access(file, err => {
                if (err) {
                    resolve(false);
                } else {
                    resolve(true);
                }
            });
        });
    },
    createFile(file, content?) {
        return new Promise((resolve, reject) => {
            fs.writeFile(file, content, err => {
                if (err) {
                    reject(new Error('写入错误'));
                } else {
                    resolve(true);
                }
            });
        });
    },
    joinPath(baseUrl: string) {
        return (path: string) => baseUrl + path;
    },
};
