// import
const express = require("express");
const expressWs = require("express-ws");
const webSocketStream = require("websocket-stream/stream");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require("fluent-ffmpeg");
const log4js = require('log4js');
const path = require("path");

// initialize constants
const LOGGER = log4js.getLogger();
LOGGER.level = log4js.levels.INFO
let HOST = process.env.RHF_HOST;
let PORT = process.env.RHF_PORT;
if (HOST === undefined) {
    HOST = "127.0.0.1"
}
if (PORT === undefined) {
    PORT = 8080
}
const CONNECT_MAP = new Map();

// initialize component
ffmpeg.setFfmpegPath(ffmpegPath);
const app = express();
expressWs(app, null, {perMessgaeDeflate: true});

// register route
// static
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.engine('.html', require('ejs').renderFile);
app.set('view engine', 'html');
// index page
app.get("/", (req, res) => {
    res.type("html");
    res.render("index", {});
});
// info page
app.get("/info", (req, res) => {
    res.type("html");
    res.render("info", {});
});
// rtsp to ws-flv
app.ws("/rtsp", rtspHandler);
// connect info
app.get("/rtsp", (req, res) => {
    res.send(Object.fromEntries(CONNECT_MAP))
});

// register port
app.listen(PORT, () => {
    LOGGER.info(
        "Server Start...\n"
        + "App running at:\n"
        + "- Local:  http://" + HOST + ":" + PORT);
});

// functions
function rtspHandler(ws, req) {
    const stream = webSocketStream(ws, {
        binary: true,
        browserBufferTimeout: 1000000
    }, {
        browserBufferTimeout: 1000000
    });

    let url = req.query.url;
    LOGGER.info("Request for", url)

    try {
        ffmpeg(url)
            // more options for rtsp with ffmpeg search https://ffmpeg.org/ffmpeg-protocols.html#rtsp
            .addInputOption("-rtsp_transport", "tcp", "-buffer_size", "102400")
            // more event handlers search https://www.npmjs.com/package/fluent-ffmpeg#setting-event-handlers
            .on("start", () => {
                if (CONNECT_MAP.get(url) >= 0) {
                    CONNECT_MAP.set(url, CONNECT_MAP.get(url) + 1)
                } else {
                    CONNECT_MAP.set(url, 1)
                }
                LOGGER.info("Transport Start...")
            })
            .on("codecData", (data) => {
                LOGGER.info("Input is " + data.audio + " audio " + "with " + data.video + " video");
            })
            .on("error", err => {
                CONNECT_MAP.set(url, CONNECT_MAP.get(url) - 1)
                LOGGER.info("Cannot process video with " + url + " for" + err.message);
            })
            .on("end", () => {
                CONNECT_MAP.set(url, CONNECT_MAP.get(url) - 1)
                LOGGER.info("Transcoding for " + url + " succeeded !");
            })
            .videoCodec('copy').noAudio().outputFormat("flv").pipe(stream);
    } catch (error) {
        console.log(error);
    }
}