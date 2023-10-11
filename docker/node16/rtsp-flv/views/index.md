<div align="center">
    <h1>
        欢迎使用rtsp转ws-flv服务
    </h1>
</div>


你可以在本地使用以下代码来新建一个html文件

>  其中`ws://127.0.0.1:8888/rtsp`为前端服务器地址，也就是本服务所运行的地址，自行修改为实际部署地址
>
> `?url=rtsp://127.0.0.1/test`为视频流服务器拉流地址，自行修改为实际拉流地址

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