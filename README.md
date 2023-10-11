<div align="center">
    <h1>
        模拟网络摄像头与转码实现网页直播
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

> 项目是在使用yolo目标检测后希望能够在网页上实时的查看原视频流和检测后的结果，从而总结的解决方案



市面上的大部分摄像头使用的协议都是RTSP，所以本项目也将模拟一个RTSP的摄像头



但RTSP是不能在网页上直接播放的，所以需要一套解决方案，将RTSP视频流转码成能够在网页上播放的视频流



网上有关于RTSP视频流如何在网页上播放的解决方案，除了收费的方案比较全面，其他方案都各有优缺点



总之，该项目将使用ffmpeg+node+flv.js的解决方案



### 基础构件

> **以下构件请确保已经下载安装，否则无法进行**

`EasyDarwin`：高性能开源RTSP流媒体服务器

`ffmpeg`：强大的多媒体编解码框架，本项目中用于将本地摄像头推流到流媒体服务器用作模拟网络摄像头

`本地摄像头`：不论是笔记本自带的摄像头还是手机摄像头，只要能够通过ffmpeg检测到，可以推流就可以

> 至此，我们就能够模拟一个rtsp协议的网络摄像头了

`node`：JavaScript 运行环境，服务器，包管理系统，和ffmpeg插件用于将rtsp视频流转为ws-flv视频流

`flv.js`：B站 (bilibili) 开源 HTML5 播放器内核，用于在网页上播放ws-flv视频流

> 至此，能够拉流，并将视频流转化为html播放的视频流

## 快速开始

如果已拥有网络摄像头可以跳过本地模拟RTSP网络摄像头的部分

### 前期准备

1. 在本地开启EasyDarwin，或者部署在服务器，这一步可以查看网上教程

2. 在本地开启摄像头推流，其中`rtsp://127.0.0.1/test`替换为EasyDarwin部署的地址

   ```shell
   ffmpeg -f dshow -i video="Integrated Camera" -s 640*360 -vcodec libx264 -preset:v ultrafast -tune:v zerolatency -r tsp_transport tcp -f rtsp rtsp://127.0.0.1/test
   ```

3. 克隆该项目

4. 安装依赖

   ```
   npm install
   ```

5. 启动JavaScript Web服务器

   ```
   node index.js
   ```

### 使用说明

你可以在本地使用以下代码来新建一个html文件

>  其中`ws://127.0.0.1:8888/rtsp`为前端服务器地址，也就是本服务所运行的地址，自行修改为实际部署地址
>
>  `?url=rtsp://127.0.0.1/test`为视频流服务器拉流地址，自行修改为实际拉流地址

```
<script src="https://cdn.bootcss.com/flv.js/1.5.0/flv.js"></script>
<video autoplay controls id="videoElement"></video>
<script>
 if (flvjs.isSupported()) {
            var flvPlayer = flvjs.createPlayer({
                type: 'flv',
                isLive: true,
				hasAudio:false,
				hasVideo:true,
                url: 'ws://127.0.0.1:8888/rtsp?url=rtsp://127.0.0.1/test',//<==自行修改
            });
            flvPlayer.attachMediaElement(videoElement);
            flvPlayer.load(); //加载
            flv_start();
        }
</script>
```

这之后就可以使用该网页来查看自己推流的视频的直播
