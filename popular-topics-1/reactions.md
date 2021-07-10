# Reactions

## Reacting to messages

One of the first things many people want to know is how to react with emojis, both custom and "regular" \(Unicode\). There are different routes you need to take for each of those, so let's look at both.

Here's the base code we'll be using:

```javascript
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {
    // ...
});

client.login('your-token-goes-here');
```

### Unicode emojis

To react with a Unicode emoji, you will need the actual Unicode character of the emoji. There are many ways to get a Unicode character of an emoji, but the easiest way would be through Discord itself. If you send a message with a Unicode emoji \(such as `:smile:`, for example\) and put a `\` before it, it will "escape" the emoji and display the Unicode character instead of the standard emoji image.

![Escaped unicode emoji](../.gitbook/assets/escaped-unicode-emoji.png)

To react with an emoji, you need to use the `message.react()` method. Once you have the emoji character, all you need to do is copy & paste it as a string inside the `.react()` method!

\`\`\`js {2-4} client.on\('message', message =&gt; { if \(message.content === '!react'\) { message.react\('😄'\); } }\);

```text
![Unicode emoji reaction](./images/unicode-emoji-reaction.png)

### Custom emojis

For custom emojis, there are multiple ways of reacting. Like Unicode emojis, you can also escape custom emojis. However, when you escape a custom emoji, the result will be different.

![Escaped custom emoji](./images/escaped-custom-emoji.png)

This format is essentially the name of the emoji, followed by its ID. Copy & paste the ID into the `.react()` method as a string.

```js {2-4}
client.on('message', message => {
    if (message.content === '!react-custom') {
        message.react('396548322053062656');
    }
});
```

![Custom emoji reaction via ID](../.gitbook/assets/custom-emoji-reaction.png)

Great! This route may not always be available to you, though. Sometimes you'll need to react with an emoji programmatically. To do so, you'll need to retrieve the emoji object.

Two of the easiest ways you can retrieve an emoji would be:

* Use `.find()` on a Collection of Emojis.
* Use `.get()` on the `client.emojis.cache` Collection.

::: tip Two or more emojis can have the same name, and using `.find()` will only return the **first** entry it finds. As such, this can cause unexpected results. :::

Using `.find()`, your code would look something like this:

\`\`\`js {2-3} if \(message.content === '!react-custom'\) { const reactionEmoji = message.guild.emojis.cache.find\(emoji =&gt; emoji.name === 'ayy'\); message.react\(reactionEmoji\); }

```text
Using `.get()`, your code would look something like this:

```js {2-3}
if (message.content === '!react-custom') {
    const reactionEmoji = client.emojis.cache.get(config.emojiID);
    message.react(reactionEmoji);
}
```

Of course, if you already have the emoji ID, you should put that directly inside the `.react()` method. But if you want to do other things with the emoji data later on \(e.g., display the name or image URL\), it's best to retrieve the full emoji object.

### Reacting in order

If you just put one `message.react()` under another, it won't always react in order as-is. This is because `.react()` is a Promise and an asynchronous operation.

\`\`\`js {2-6} client.on\('message', message =&gt; { if \(message.content === '!fruits'\) { message.react\('🍎'\); message.react\('🍊'\); message.react\('🍇'\); } }\);

```text
![Reaction race condition](./images/race-condition.png)

As you can see, if you leave it like that, it won't display as you want. It was able to react correctly on the first try but reacts differently each time after that.

Luckily, there are two easy solutions to this. The first would be to chain `.then()`s in the order you want it to display.

```js {3-6}
client.on('message', message => {
    if (message.content === '!fruits') {
        message.react('🍎')
            .then(() => message.react('🍊'))
            .then(() => message.react('🍇'))
            .catch(error => console.error('One of the emojis failed to react:', error));
    }
});
```

The other would be to use the `async`/`await` keywords.

\`\`\`js {1,3-9} client.on\('message', async message =&gt; { if \(message.content === '!fruits'\) { try { await message.react\('🍎'\); await message.react\('🍊'\); await message.react\('🍇'\); } catch \(error\) { console.error\('One of the emojis failed to react:', error\); } } }\);

```text
If you try again with either of the code blocks above, you'll get the result you originally wanted!

![Emojis reacting in correct order](./images/reaction-correct-order.png)

::: tip
If you aren't familiar with Promises or `async`/`await`, you can read more about them on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or [our guide page on async/await](/additional-info/async-await.md)!
:::

### Handling multiple reactions if the order doesn't matter

However, if you don't mind the order the emojis react in, you can take advantage of `Promise.all()`, like so:

```js {2-7}
if (message.content === '!fruits') {
    Promise.all([
        message.react('🍎'),
        message.react('🍊'),
        message.react('🍇'),
    ])
        .catch(error => console.error('One of the emojis failed to react:', error));
}
```

This small optimization allows you to use `.then()` to handle when all of the Promises have resolved, or `.catch()` when one fails. You can also `await` it since it returns a Promise itself.

## Removing reactions

Now that you know how to add reactions, you might be asking, how do you remove them? In this section, you will learn how to remove all reactions, remove reactions by user, and remove reactions by emoji.

::: warning All of these methods require `MANAGE_MESSAGES` permissions. Ensure your bot has permissions before attempting to utilize any of these methods, as it will error if it doesn't. :::

### Removing all reactions

Removing all reactions from a message is the easiest, the API allows you to do this through a single call. It can be done through the `message.reactions.removeAll()` method.

```javascript
message.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
```

### Removing reactions by emoji

Removing reactions by emoji is easily done by using `MessageReaction.remove()`.

```javascript
message.reactions.cache.get('484535447171760141').remove().catch(error => console.error('Failed to remove reactions: ', error));
```

### Removing reactions by user

::: tip If you are not familiar with `Collection.filter()` and [`Map.has()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map/has) take the time to understand what they do and then come back. :::

Removing reactions by a user is not as straightforward as removing by emoji or removing all reactions. The API does not provide a method for selectively removing the reactions of a user. This means you will have to iterate through reactions that include the user and remove them.

```javascript
const userReactions = message.reactions.cache.filter(reaction => reaction.users.cache.has(userId));
try {
    for (const reaction of userReactions.values()) {
        await reaction.users.remove(userId);
    }
} catch (error) {
    console.error('Failed to remove reactions.');
}
```

::: warning Make sure not to remove reactions by emoji or by user too much; if there are many reactions or users, it can be considered API spam. :::

## Awaiting reactions

A common use case for reactions in commands is having a user confirm or deny an action or creating a poll system. Luckily, we actually [already have a guide page covering this](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/collectors.md)! Check out that page if you want a more in-depth explanation. Otherwise, here's a basic example for reference:

```javascript
message.react('👍').then(() => message.react('👎'));

const filter = (reaction, user) => {
    return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
};

message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
        const reaction = collected.first();

        if (reaction.emoji.name === '👍') {
            message.reply('you reacted with a thumbs up.');
        } else {
            message.reply('you reacted with a thumbs down.');
        }
    })
    .catch(collected => {
        message.reply('you reacted with neither a thumbs up, nor a thumbs down.');
    });
```

## Listening for reactions on old messages

Messages sent before your bot started are uncached unless you fetch them first. By default, the library does not emit client events if the data received and cached is not sufficient to build fully functional objects. Since version 12, you can change this behavior by activating partials. For a full explanation of partials see [this page](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/partials.md).

Make sure you enable partial structures for `MESSAGE`, `CHANNEL`, and `REACTION` when instantiating your client if you want reaction events on uncached messages for both server and direct message channels. If you do not want to support direct message channels, you can exclude `CHANNEL`.

::: tip If you use [gateway intents](https://github.com/zachjmurphy/guide/tree/9925b2dac70a223dd2dbb549ce57ddb5515bcbc0/popular-topics/intents.md) but can't or don't want to use the privileged `GUILD_PRESENCES` intent, you additionally need the `USER` partial. :::

```javascript
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
client.on('messageReactionAdd', async (reaction, user) => {
    // When a reaction is received, check if the structure is partial
    if (reaction.partial) {
        // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
        try {
            await reaction.fetch();
        } catch (error) {
            console.error('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    // Now the message has been cached and is fully available
    console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
    // The reaction is now also fully available and the properties will be reflected accurately:
    console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});
```

::: warning Partial structures are enabled globally. You cannot only make them work for a specific event or cache, and you very likely need to adapt other parts of your code that are accessing data from the relevant caches. All caches holding the respective structure type might return partials as well! :::

## Resulting code
