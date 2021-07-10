# Introduction

"Voice" refers to the ability of a bot to send audio in voice channels. discord.js makes it easy for you to get up and running with voice!

## Quick example

```javascript
async function play(voiceChannel) {
    const connection = await voiceChannel.join();
    connection.play('audio.mp3');
}
```

## Installing dependencies

At the bare minimum, you'll need:

* An Opus library:
  * [`@discordjs/opus`](https://github.com/discordjs/opus) \(best performance\)
  * [`node-opus`](https://github.com/Rantanen/node-opus/)
  * [`opusscript`](https://github.com/abalabahaha/opusscript/)

You may also choose to install the following dependencies.

* FFmpeg \(recommended\) – allows you to play a range of media \(e.g. MP3s\).
  * **This guide will assume you have installed FFmpeg.**
  * [`ffmpeg`](https://ffmpeg.org/) - install and add to your system environment
  * [`ffmpeg-static`](https://www.npmjs.com/package/ffmpeg-static) - to install FFmpeg via npm
* Faster encryption packages
  * [`sodium`](https://www.npmjs.com/package/sodium) \(best performance\)
  * [`libsodium-wrappers`](https://www.npmjs.com/package/libsodium-wrappers)

::: tip Outside a development environment, it is recommended for you to use `@discordjs/opus` and `sodium` to improve performance and improve the stability of audio playback!

If you're struggling to install these dependencies, make sure you have build tools installed first. On Windows, this is as easy as running `npm install --global --production --vs2015 --add-python-to-path windows-build-tools`! :::

