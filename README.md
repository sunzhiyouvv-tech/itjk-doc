# ITJK Doc

ITJK 文档工具箱部署仓库。

本仓库在 Vercel 构建时拉取固定版本的 [OmniTools](https://github.com/iib0011/omni-tools) 源码并生成静态站点。

## Vercel

- Build Command: `sh scripts/build.sh`
- Output Directory: `dist`
- Install Command: `echo "No root dependencies"`

上游版本固定在 `scripts/build.sh` 的 `UPSTREAM_SHA`，需要升级时修改该值即可。
