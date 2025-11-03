[English](../README.md) · **简体中文**

# SUESMC 客户端

一个 SJMC Launcher (SJMCL) 的分支版本。

前往 [UNIkeEN/SJMCL](https://github.com/UNIkeEN/SJMCL) 以了解更多关于 SJMCL 的信息。

## 开发

```bash
git clone git@github.com:SUESMC-Dev/SUESMC-Client.git
npm install
npm run tauri dev
```

## 版权声明

版权所有 © 2024-2025 SJMCL 团队。经 SUESMC-Dev 按协议修改并分发。

> 本软件并非官方 Minecraft 服务。未获得 Mojang 或 Microsoft 批准或关联许可。

本项目基于 [GNU 通用公共许可证 v3.0](../LICENSE) 发布。

依据 GPLv3 第 7 条款，当您分发本软件的修改版本时，除遵守 GPLv3 外，还须遵守以下 [附加条款](../LICENSE.EXTRA)：

1. 必须更换软件名称，禁止使用 SJMCL 或 SJMC Launcher；
2. 在您的仓库 README、分发网站或相关文档、软件的关于页面中，须明确标注您的程序基于 SJMCL，并注明原仓库链接。
3. 当对本软件的修改仅限于**增加**（而非修改或删除）预置认证服务器（`src-tauri/src/account/helpers/authlib_injector/constants.rs`）时，前述第 1 条限制不适用。在该情形下，您可继续使用原始的软件名称进行编译与分发。

另根据我们网站的用户协议，当您分发本软件的修改版本时，请仅向我们的信息统计服务器（`src-tauri/src/utils/sys_info.rs`）发送带前缀（不少于两个字母，如 `XX-0.0.1`）的版本号，除非您的修改满足上述第 3 条限制。
