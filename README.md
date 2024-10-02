# MnemeAI on Obsidian

## Description

This is a plugin for [Obsidian](https://obsidian.md) that uses the our product [MnemeAI](https://mneme.ai) to provide AI-powered capabilities to your Obsidian vault.

## Features

- **Summarize**: Summarize a note using MnemeAI's AI.
- **To be added**: More features to be added soon.

## Usage

1. Clone this repository to your local folder.
2. Open the terminal and run `npm install` to install the dependencies.
3. Run `npm run dev` to start the development environment. If the bundle is successfully created, you should see a message like `Watching for changes...`. A default MnemeAI vault will be created in the root of your current directory.
4. Open Obsidian, select the `MnemeAI` vault, and enable the plugin in the settings.

## API

1. Get the latest version of a file: `GET /file/latest?name=FILENAME`
2. Create a new canvas file: `POST /file/canvas`
3. Modify an existing canvas file: `PUT /file/canvas`
