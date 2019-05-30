# CMFL Desktop
This is a guide about installing the project this will cover how to install the project on:
  - Mac OS X
  - Debian Linux
  - Windows 10


### Tech
CMFL Desktop uses a number of open source projects to work properly:

* [React] - HTML enhanced for web apps!
* [Redux] - awesome web-based text editor
* [Electron] - Markdown parser done right. Fast and easy to extend.
* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework [@tjholowaychuk]


# First steps

# 1)_ Install nodejs 6.xx, minimum, preferable 8.xx

# Using Ubuntu
```
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
```
# Using Debian, as root
curl -sL https://deb.nodesource.com/setup_8.x | bash -
apt-get install -y nodejs
  - Drag and drop images (requires your Dropbox account be linked)

# Using Mac Os X
Download node from https://nodejs.org/dist/v8.10.0/node-v8.10.0.pkg

# Using Windows 10
Download node from https://nodejs.org/dist/v8.10.0/node-v8.10.0-x86.msi

# 2)_ Install modules

```
npm install --unsafe-perm=true --allow-root
```
The arguments given to npm are in order to aoid EPERM and EACCESS errors in macos and, sometimes, in linux.

### Installation
To install/Run the environment once you have installed node and electron should be as easy as:

```sh
$ cd CMFLDesktop
$ npm install -d
$ npm start
```

More to come here... (cross platform build, separated or partial build, unit tests)
