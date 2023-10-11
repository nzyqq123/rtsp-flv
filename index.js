const express = require("express");
const expressWs = require("express-ws");
const webSocketStream = require("websocket-stream/stream");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const log4js = require('log4js');
const logger = log4js.getLogger();
logger.level = log4js.levels.INFO
const path = require("path");
const {response} = require("express");
let HOST = process.env.RHF_HOST;
let PORT = process.env.RHF_PORT;
if (HOST === undefined) {
    HOST = "127.0.0.1"
}
if (PORT === undefined) {
    PORT = 8080
}
const MAP = new Map();


const app = express();
expressWs(app, null, {perMessgaeDeflate: true});


app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
app.get("/", (req, res) => {
    res.type("html");
    res.render("index", {});
});


app.ws("/rtsp", rtspHandler);
app.get("/rtsp", (req, res) => {
    res.send(Object.fromEntries(MAP))
});


app.listen(PORT, () => {
    logger.info(
        "Server Start...\n"
        + "App running at:\n"
        + "- Local:  http://" + HOST + ":" + PORT);
});


function rtspHandler(ws, req) {
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });

    let url = req.query.url;
    logger.info("Request for", url)

    try {
        ffmpeg(url)
            // more options for rtsp with ffmpeg search https://ffmpeg.org/ffmpeg-protocols.html#rtsp
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")
            // more event handlers search https://www.npmjs.com/package/fluent-ffmpeg#setting-event-handlers
            .on("start", () => {
                if (MAP.get(url) >= 0) {
                    MAP.set(url, MAP.get(url) + 1)
                } else {
                    MAP.set(url, 1)
                }
                logger.info("Transport Start...")
            })
            .on("codecData", (data) => {
                logger.info("Input is " + data.audio + " audio " + "with " + data.video + " video");
            })
            .on("error", err => {
                MAP.set(url, MAP.get(url) - 1)
                logger.info("Cannot process video with " + url + " for" + err.message);
            })
            .on("end", () => {
                MAP.set(url, MAP.get(url) - 1)
                logger.info("Transcoding for " + url + " succeeded !");
            })
            .videoCodec('copy').noAudio().outputFormat("flv").pipe(stream);
    } catch (error) {
        console.log(error);
    }
}