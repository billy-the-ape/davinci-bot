# Davinci Bot

### Making AI Bot Simple

Davinci Bot is an easily configurable OpenAI Powered Discord Bot

---

### Steps to run:

1. [Install nodejs 16+](https://nodejs.org/en/download/)
2. Install yarn with `npm install -g yarn`
3. Install packages with `yarn`
4. Build with `yarn build` and start with `yarn start` (or use `yarn dev` to do both in one step!)
5. Copy `.env.example` to `.env.local` and populate the values to configure.

---

### Configurations:

Configuration is done within the `.env.local` file you created above. Here are details for each option:

#### `DISCORD_BOT_TOKEN` \*Required

Set up your Discord bot in the [Discord Developer Portal](https://discord.com/developers/applications) ([More info](https://discord.com/developers/docs/getting-started#creating-an-app)). Paste the token you receive in this process into this variable.

#### `OPENAI_API_KEY` \*Required

Create an [OpenAI account for API access](https://openai.com/api/) and then [create a secret key](https://platform.openai.com/account/api-keys). Paste this into this variable.

#### `RESPOND_PROMPTS`

These are comma-seperated messages which if the Discord bot notices an exact match (case insensitive), it will automatically respond to without being directly mentioned or replied to. Defaults to none (blank string)

#### `OPENAI_MODEL`

Set the name of the model you wish to use. Can put any model your API key can access, including trained/fine tuned models. Defaults to `text-davinci-003` (the current latest & greatest) if no value is set.

#### `OPENAI_BEHAVIOR`

Describe how you want your bot to behave. Defaults to `friendly, helpful and professional` if no value is set.

#### `OPENAI_NAME`

Name of your bot. If someone asks "what is your name" this is how it will respond, basically. Defaults to `Davinci` if no value is set.

#### `OPENAI_TEMPERATURE`

Temperature of the bot. [More info here](https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature). Defaults to `0.8` if no value is set.

#### `OPENAI_MAX_TOKENS`

Max tokens of the bot reponse. [More info here](https://platform.openai.com/docs/api-reference/completions/create#completions/create-max_tokens). Defaults to `1000` if no value is set.

#### `NO_LOG`

If set to `true`, the node application will not log to the terminal.
