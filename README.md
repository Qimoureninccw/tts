# SilenceTTSAPI 使用文档

> AI 驱动的语音合成 API，一次请求返回 mp3 音频流。

---

## 基础信息

| 项目 | 说明 |
|------|------|
| 名称 | SilenceTTSAPI |
| Base URL | https://silence-tts-api.de5.net/ |
| 请求方式 | GET |
| 返回格式 | audio/mpeg（mp3 音频流） |
| CORS | 已开启，支持跨域 |
| 鉴权 | 无需鉴权 |

---

## 接口：文字转语音

GET /create?txt=文本

### 请求参数

| 参数 | 必填 | 类型 | 默认值 | 说明 |
|------|------|------|--------|------|
| txt | 是 | string | — | 要转换的文本内容 |
| voice | 否 | string | zh-CN-XiaoxiaoNeural | 音色，见下方音色表 |
| speed | 否 | number | 1.0 | 语速，范围 0.5 ~ 2.0 |
| pitch | 否 | number | 0 | 音调，范围 -50 ~ 50 |
| style | 否 | string | general | 语音风格，见下方风格表 |

### 返回

成功：audio/mpeg 二进制音频流（mp3）

失败：JSON 错误信息

{
  "error": {
    "message": "缺少参数 txt",
    "type": "invalid_request_error",
    "param": "txt",
    "code": "missing_txt"
  }
}

---

## 调用示例

### 1. 最简用法

https://silence-tts-api.de5.net/create?txt=你好世界

### 2. 指定音色和语速

https://silence-tts-api.de5.net/create?txt=你好世界&voice=zh-CN-YunxiNeural&speed=1.2

### 3. 带音调和风格

https://silence-tts-api.de5.net/create?txt=今天天气真好&voice=zh-CN-XiaoxiaoNeural&speed=1.0&pitch=10&style=cheerful

### 4. 前端 audio 直接播放

<audio controls src="https://silence-tts-api.de5.net/create?txt=欢迎使用VoiceCraft"></audio>

### 5. JavaScript 调用

const text = "你好，这是一段测试语音";
const url = `https://silence-tts-api.de5.net/create?txt=${encodeURIComponent(text)}&voice=zh-CN-YunxiNeural`;

const audio = new Audio(url);
audio.play();

### 6. 下载音频

const text = "要下载的内容";
const url = `https://silence-tts-api.de5.net/create?txt=${encodeURIComponent(text)}`;

const a = document.createElement('a');
a.href = url;
a.download = 'speech.mp3';
a.click();

### 7. curl 命令行

curl "https://silence-tts-api.de5.net/create?txt=你好世界" -o output.mp3

### 8. Python 示例

import requests

url = "https://silence-tts-api.de5.net/create"
params = {
    "txt": "你好，这是Python调用的测试",
    "voice": "zh-CN-XiaoxiaoNeural",
    "speed": 1.0,
    "style": "cheerful"
}

resp = requests.get(url, params=params)
with open("output.mp3", "wb") as f:
    f.write(resp.content)

### 9. Node.js 示例

const fs = require('fs');
const https = require('https');

const text = encodeURIComponent('你好，这是Node.js调用的测试');
const url = `https://silence-tts-api.de5.net/create?txt=${text}&voice=zh-CN-YunxiNeural`;

https.get(url, (res) => {
  const file = fs.createWriteStream('output.mp3');
  res.pipe(file);
  file.on('finish', () => file.close());
});

---

## 音色表（voice）

| 值 | 说明 |
|----|------|
| zh-CN-XiaoxiaoNeural | 晓晓（女声·温柔）默认 |
| zh-CN-YunxiNeural | 云希（男声·清朗） |
| zh-CN-YunyangNeural | 云扬（男声·阳光） |
| zh-CN-XiaoyiNeural | 晓伊（女声·甜美） |
| zh-CN-YunjianNeural | 云健（男声·稳重） |
| zh-CN-XiaochenNeural | 晓辰（女声·知性） |
| zh-CN-XiaohanNeural | 晓涵（女声·优雅） |
| zh-CN-XiaomengNeural | 晓梦（女声·梦幻） |
| zh-CN-XiaomoNeural | 晓墨（女声·文艺） |
| zh-CN-XiaoqiuNeural | 晓秋（女声·成熟） |
| zh-CN-XiaoruiNeural | 晓睿（女声·智慧） |
| zh-CN-XiaoshuangNeural | 晓双（女声·活泼） |
| zh-CN-XiaoxuanNeural | 晓萱（女声·清新） |
| zh-CN-XiaoyanNeural | 晓颜（女声·柔美） |
| zh-CN-XiaoyouNeural | 晓悠（女声·悠扬） |
| zh-CN-XiaozhenNeural | 晓甄（女声·端庄） |
| zh-CN-YunfengNeural | 云枫（男声·磁性） |
| zh-CN-YunhaoNeural | 云皓（男声·豪迈） |
| zh-CN-YunxiaNeural | 云夏（男声·热情） |
| zh-CN-YunyeNeural | 云野（男声·野性） |
| zh-CN-YunzeNeural | 云泽（男声·深沉） |

---

## 风格表（style）

| 值 | 说明 |
|----|------|
| general | 通用风格（默认） |
| assistant | 智能助手 |
| chat | 聊天对话 |
| customerservice | 客服专业 |
| newscast | 新闻播报 |
| affectionate | 亲切温暖 |
| calm | 平静舒缓 |
| cheerful | 愉快欢乐 |
| gentle | 温和柔美 |
| lyrical | 抒情诗意 |
| serious | 严肃正式 |

---

## 注意事项

1. URL 编码：中文文本建议用 encodeURIComponent() 编码，尤其是通过 JS 调用时。

   ❌ /create?txt=你好 世界
   ✅ /create?txt=你好%20世界

2. 长文本：支持长文本（内部自动分块），但建议单次不超过 10000 字，避免超时。

3. 参数优先级：不传参数时使用默认值，传了就用传入的值。

4. 返回类型：永远是 mp3，Content-Type 为 audio/mpeg。

---

## 快速测试

部署后，直接在浏览器打开这个链接，能听到声音就说明成功：

https://silence-tts-api.de5.net/create?txt=你好，欢迎使用SilenceTTSAPI

---

## 错误码

| HTTP 状态码 | 说明 |
|-------------|------|
| 200 | 成功，返回 mp3 音频流 |
| 400 | 参数错误（如缺少 txt） |
| 500 | 服务器内部错误（如合成失败） |
