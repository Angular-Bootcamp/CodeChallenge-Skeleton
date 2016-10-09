# Accenture BootCamp - Code Challenge Generator

A generator for creating the skeleton of the Accenture-BootCamp project.

## Installation

Install the package dependencies:

    npm install -g yo bower
    gem install sass

Install the generator:

    npm install -g generator-accenture-bootcamp-skeleton

## Usage

Make a new directory, and `cd` into it:

    mkdir <codechallengeName>
    cd <codechallengeName>

Run the yeoman generator:

    yo accenture-bootcamp-skeleton

Compile the styles using sass:

    sass app/sass/main.scss app/styles/app.css

Create a local POKEDEX data with the command:

    node src/pokeapi.local.js

Note: Initially and only for testing purposes you should only use a portion of all the POKEDEX locally, focus your time on what's important.

Run the application with node:

    node src/server.js

## Contributing

We are more than happy to accept external contributions to the project in the form of feedback, bug reports and even better - pull requests.

### Issue submission

In order for us to help you please check that you've completed the following steps:

* Made sure you're on the latest version npm update -g yo
* Used the search feature to ensure that the bug hasn't been reported before
* Included as much information about the bug as possible, including any output you've received, what OS and version you're on, etc.
* Shared the output from running the following command in your project root as this can also help track down the issue:

  Unix:
    yo --version && echo $PATH $NODE_PATH && node -e 'console.log(process.platform, process.versions)' && cat Gruntfile.js

  Windows:
    yo --version && echo %PATH% %NODE_PATH% && node -e "console.log(process.platform, process.versions)" && type Gruntfile.js


### Quick Start

* Clone this repo and then run npm install in them.
* Go to the generator folder and link it globally using `npm link`.
* Run `yo ccenture-bootcamp-skeleton` and you should now see the generator output.
* Start hacking :)

### Style Guide

This project uses single-quotes, two space indentation, multiple var statements and whitespace around arguments. Use a single space after keywords like function. Ex:

  function () { ... }

  function foo() { ... }

Please ensure any pull requests follow this closely. If you notice existing code which doesn't follow these practices, feel free to shout and we will address this.

### Pull Request Guidelines

Please check to make sure that there aren't existing pull requests attempting to address the issue mentioned. We also recommend checking for issues related to the issue on the tracker, as a team member may be working on the issue in a branch or fork.

* Non-trivial changes should be discussed in an issue first
* Develop in a topic branch, not master
* Squash your commits
* Write a convincing description of your PR (pull-request) and why we should land it

## License

Copyright (c) 2016 David Sosa Valdes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
