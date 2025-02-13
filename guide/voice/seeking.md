# Seek

discord.js does not have a built-in method for seeking audio resources. However external libraries such as `prism-media` can be used to tackle this issue.

### Sample code 

To seek resource, you can create a new function with  the following code:

```js
// Require necessary package
const prism = require('prism-media');

function createFFmpegStream(stream, seek) {
	let seekPosition = '0';
	if (seek) seekPosition = String(seek);
	const transcoder = new prism.FFmpeg({
		args: ['-analyzeduration', '0', '-loglevel', '0', '-f', 's16le', '-ar', '48000', '-ac', '2', '-ss', seekPosition, '-ab', '320',],
	});
	const s16le = stream.pipe(transcoder);
	const opus = s16le.pipe(new prism.opus.Encoder({ rate: 48000, channels: 2, frameSize: 960 }));
	return opus;
}
```
The first argument for this function should be audio stream, and second one should be int within duration of the stream.
The function returns the seeked stream. For more configuration options you can look at the [prism media documentation](https://amishshah.github.io/prism-media/).

### Complete Code

```js
const { createAudioResource, createAudioPlayer } = require('@discordjs/voice');
const fs = require('fs');

const player = createAudioPlayer();
const normalAudioResource = createAudioResource('Your audio file path');

player.play(normalAudioResource);

const seekedAudioStream = createFFmpegStream(fs.createReadStream('Your audio file path'), 10); // Seek to 10s
const seekedAudioResource = createAudioResource(seekedAudioStream);

player.play(seekedAudioResource);
```

The first argument of the `createFFmpegStream` method would be your stream.
