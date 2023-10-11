<div align="center">
    <h1>
        Docker部署rtsp转ws-flv服务
    </h1>
</div>
<details open="open">
<summary>目录</summary>
    <ul>
        <li>
            <a href="#关于项目">关于项目</a>
        	<ul>
                <li><a href="#基础构件">基础构件</a></li>
            </ul>
        </li>
        <li>
            <a href="#快速开始">快速开始</a>
        	<ul>
                <li><a href="#前期准备">前期准备</a></li>
                <li><a href="#使用说明">使用说明</a></li>
            </ul>
        </li>
    </ul>
</details>




## 关于项目

该项目是使用docker部署rtsp转ws-flv服务

该服务可以用于在网页上播放网络摄像头的视频流

### 基础构件

> **以下构件请确保已经下载安装，否则无法进行**

`Docker`：Docker 是一个开源的应用容器引擎

`Dokcer Compose`：Compose 是用于定义和运行多容器 Docker 应用程序的工具。

## 快速开始

### 前期准备

```
# 确认是否安装docker
docker version

# 确认是否安装docker compose
docker compose version
# 或者
docker-compose version
```

### 使用说明

构建并启动服务

```
docker compose up -d
```

查看服务是否启动成功

```
docker ps
```