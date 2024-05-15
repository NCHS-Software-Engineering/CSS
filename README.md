# Classroom Scheduling System

The CSS is a dynamic web application designed to allow teachers to modify and preview schedules on a clock interface. It is currently designed to run on desktop computers through a web browser. The application has a client component that is meant to be displayed in a classroom, and an administrator component that controls the client's display.

## Getting Started

These instructions will guide you on how to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

To make this work you need to download the latest versions of [Visual Studio Code](https://code.visualstudio.com/download), [Git](https://git-scm.com/downloads), and [Node.js](https://nodejs.org/en) if you do not have it downloaded already.

## Dependencies
* @mui/material
* @mui/joy
* @mui/system
* @emotion/react
* @emotion/styled
* @fontsource/inconsolata
* @mui/x-date-pickers
* @react-oauth/google
* dayjs
* gapi-scripts
* mui-color-input
* nodemon
* react-color
* react-draggable-list
* react-router-dom
* react-scripts

Dependencies must be installed with npm syntax, followed by --legacy-peer-deps

### Installation

1. Open Visual Studio Code and clone the repository on a local computer.
2. Open the repository when prompted.
3. Split your terminal into three separate terminals for running the admin, client, and server respectively.
4. Run `cd Clock/admin`, `cd Clock/client`, and `cd Clock/server` in each terminal respectively to change directory so it can find npm for each one.
5. Run `npm update` in each terminal to update all dependencies.
6. Once the installation is complete, run `npm start dev` in the server and run `npm start` in the other two to start the application.

## Usage

Once the application is running, it will direct you to the admin website. Here, you can just modify the schedule as you need it.

## Data Storage

The application uses JSON files for data storage of the schedules, and a database for Google Authentication IDs.

## Contributing

Authors: Michael Mihailov, Eric Gu, Nick Patel, Nicole Liang
Client: Mr. Kevin Hayes
Mentor: Mr. Clint Rutkas
Teacher: Dr. Derek Miller
