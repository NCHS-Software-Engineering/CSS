# Classroom Scheduling System

The CSS is a dynamic web application designed to allow teachers to modify and preview schedules on a clock interface. It is currently designed to run on desktop computers through a web browser. The application has a client component that is meant to be displayed in a classroom, and an administrator component that controls the client's display.

# CSS (Next Rework)
While CSS is currently in a functional state, I took it upon myself (being already familiar with the Next.js ecosystem) to upgrade the project to Next.js.\
This fork is the full-fledged rewrite of the React scripts into Next.js.\
Be sure to read instructions carefully, as it is not the same as main.

# REQUIRED SERVER SECRETS
Please ask for these secrets. Things will fail if you don't have them.
- project_id
- supabase_url
- supabase_key
- nodemailer_user
- nodemailer_pass

## Getting Started

These instructions will guide you on how to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

To make this work you need to download the latest versions of [Visual Studio Code](https://code.visualstudio.com/download), [Git](https://git-scm.com/downloads), and [Node.js](https://nodejs.org/en) if you do not have it downloaded already.

## Dependencies
* @beanthealien/net
* @supabase/supabase-js
* bcrypt
* cookie-parser
* cors
* dotenv
* express
* jsonwebtoken
* next
* node-schedule
* react
* react-dom
* ws
* @mui/material
## Dev Dependencies
* @tailwindcss/turbopack
* @types/bcrypt
* @types/cookie-parser
* @types/cors
* @types/express
* @types/jsonwebtoken
* @types/node
* @types/node-schedule
* @types/react
* @types/react-dom
* @types/ws
* eslint
* eslint-config-next
* tailwindcss
* typescript

Dependencies must be installed with npm syntax, followed by --legacy-peer-deps

### Installation
1. Open Visual Studio Code and clone the repository on a local computer.
2. Open the repository when prompted.
4. Split your terminal into **two** separate terminals for running the client and server (Ctrl+Shift+5 on Windows or click down arrow and "Split Terminal").
5. Navigate to `css/app/` in each terminal.
6. Run `npm i` in either terminal.
7. Run `npm run sv` in the second terminal.
8. Run `npm run dev` in the first terminal.

## Usage

Once the application is running, it will direct you to the admin website. Here, you can just modify the schedule as you need it.

## Data Storage

The application uses JSON files for data storage of the schedules, and a database for Google Authentication IDs.

## Contributing

Authors: Michael Mihailov, Eric Gu, Nick Patel, Nicole Liang
Client: Mr. Kevin Hayes
Mentor: Mr. Clint Rutkas
Teacher: Dr. Derek Miller
