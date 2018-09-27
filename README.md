# [dExplorer][dexplorer_desktop] – dExplorer Desktop Client for dPay's network

This is the complete source code and the build instructions for the alpha version of the [dPay blockchain](https://dpays.io/) desktop client **dExplorer**.

![Preview of dExplorer](https://cdn.dsiteimages.com/DQmeZgTQCrsBVxk7DzCEUpXujzsx142obVPfXw2jW2kkKcW/shot.png)

## What is already implemented

* Surfing your feed and trending/hot stuff
* Creating new posts
* Commenting
* Voting with any %
* Reading replies/comments/mentions
* Drafts `synced with dExplorer Mobile`
* Post Schedules `synced with dExplorer Mobile`
* Bookmarks `synced with dExplorer Mobile`
* Favorites `synced with dExplorer Mobile`
* Comments/Memo Encryption
* Night Mode (Dark Theme)
* Wallet Transfers
* Image Gallery
* Interesting Users Discovery
* Detailed Voters Info
* Witness Voting

More functions are coming!

## Supported systems

* Windows XP - Windows 10
* Mac OS X 10.6 - Mac OS X 10.13
* Ubuntu 12.04 - Ubuntu 18.04
* Fedora 22 - Fedora 24

## Build instructions

### Clone

```
$ git clone https://github.com/dpays/dexplorer-desktop
$ cd dexplorer-desktop
```

### Install dependencies

> Make sure you have node.js and npm installed

> Make sure bower installed globally (npm install -g bower)

```
$ npm install
$ bower install
```

### Run in development mode

```
$ npm start
```

### Package

```
$ npm run release
```

### Test

(Tests are not fully covered/implemented yet)

```
$ npm run test
```

[//]: # (LINKS)
[dexplorer_desktop]: https://dexplorer.io
