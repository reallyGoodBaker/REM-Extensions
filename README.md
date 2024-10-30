## 安装依赖
```bash
npm i
```

## 修改打包的目标(index.json)
```json
[ "example", "example2" ]
```

## 构建源码（打包为文件夹）
```bash
npm run build-source
```

## 构建压缩文件（tar）
```bash
npm run build-binaries
```

## 开发部署
将 ` src/src1 `, ` src/src2 `, ` src/src3 ` 打包后移动到 ` %appdata%/Data/Extensions ` 下
```bash
npm run dev -- src1 src2 src3
```