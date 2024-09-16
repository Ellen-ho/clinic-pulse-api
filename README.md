# Clinic-Pulse-api

## Table of contents

- [User Interface](#User-Interface)
- [About Clinic-Pulse](#About-Clinic-Pulse)
- [Architecture Diagram](#architecture-diagram)
- [Features](#Features)
- [Local development](#local-development)

## About Clinic-Pulse

Clinic-Pulse is a clinic management system that integrates real-time outpatient information, historical data, statistics, and charts, enabling doctors and administrators to oversee every aspect of the medical workflow. This system not only enhances clinic operational efficiency but also leverages data analytics to optimize medical decision-making, ultimately improving the patient experience.

## Architecture Diagram

Users enter a URL in the browser, which Route 53 resolves to an IP address. Traffic is managed by a Load Balancer. The frontend, built with React and MUI, is deployed on S3 and delivered via CloudFront CDN. A separate S3 bucket stores doctor profile photos.

The backend is containerized with Docker and runs on EC2 using Node.js and Express. Socket.IO provides real-time updates, and Bull manages asynchronous tasks. Data is stored in RDS (PostgreSQL), and Redis on another EC2 instance handles caching and queue management.

Gmail Service is used to send password reset emails.

## Features

### Admin

As admin, you can...

1. egister New Employees: Create accounts for newly hired staff and enter their detailed information.
2. Real-Time Dashboard: View the current outpatient status of each clinic room across all branches on the real-time dashboard page.
3. Outpatient List with Advanced Filters: Use various filters to view the outpatient list, including time range, branch, time slot, doctor's name, patient's name, minimum total duration, and maximum total duration.
4. Click on any outpatient entry to view detailed information.
5. If there are abnormal waiting times—such as waiting for consultation, treatment bed arrangement, acupuncture treatment, needle removal, or medication pickup exceeding the set time—you will receive instant notifications automatically sent by the system.
6. Feedback List with Advanced Filters: Use various filters to view the feedback list, including time range, branch, time slot, feedback rating, doctor's name, and patient's name. Click on any feedback entry to view detailed feedback information.
7. Google Reviews List with Advanced Filters: Use various filters to view the Google reviews list, including time range, branch, review rating, and patient's name. Click on any review to view detailed information.
8. Statistics Center: Access three statistical categories—Outpatient, Feedback, and Google Reviews.
9. Outpatient Statistics: View various outpatient-related statistical charts based on time granularity, including total and average number of patients, number of first-time visits and first-visit rate, number of online appointments and online appointment rate, number of cancellations and cancellation rate, average waiting time, and the number and ratio of acupuncture and medication treatments.
10. Feedback Statistics: View feedback-related statistical charts based on time granularity, including feedback ratings and categories.
11. Google Reviews Statistics: View review-related statistical charts based on time granularity, including review ratings and ratios.
12. View Outpatient Schedules: Check the outpatient schedules for each branch.
13. Receive Low-Rating Notifications: Get automatic notifications from the system when there are feedback or reviews with ratings lower than five stars.
14. Manage Notifications: Click on the bell icon to view the notification list. You can mark notifications as read or delete them individually or all at once. Clicking on any notification allows you to see the related outpatient, feedback, or review details.

## Local development

### Setup

The following tools need to be installed on your system in advance:

- `git`: `>=2`
- `nodejs`: `>=16 <17`
- `npm`: `>=8 <9`
- `docker`: `>=18.09`
- `docker-compose`: `>=1.28.6` (service profiles is not supported until version `1.28.0`)

### Install dependency

First clone the repository, then run the following commands to install the dependencies:

```shell
npm clean-install
```

**please do not use the command npm install as it might upgrade dependencies unintentionally**

### Setup database

1. Setup environment variables by coping `.env-sample` file to `.env` and fill it proper values
2. Run the PostgreSQL using docker-compose:

```shell
docker-compose --profile dev up -d [--build]
```

If you encounter problems with docker-compose, you may run:

```
$ docker-compose down [--rmi local] [--remove-orphans] [-v]
```

- `docker-compose down` will stop & remove the containers
- `--rmi local` will remove local images
- `--remove-orphans` will remove unneeded orphan containers
- `-v` will remove volumes (**WARNING: THIS WILL WIPE ALL YOUR OLD LOCAL DATABASE DATA**)

### Running the application

```shell
npm run dev
```

### Lint and formatting

We recommend that you use [Visual Studio Code](https://code.visualstudio.com/) to work on the project. We use [ESLint](https://github.com/eslint/eslint) & [Prettier](https://github.com/prettier/prettier) to keep our code consistent in terms of style and reducing defects. We recommend installing the the [ESLint Extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) & [Prettier Extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) as well.

Reference: [Setting up ESlint with Standard and Prettier](https://medium.com/nerd-for-tech/setting-up-eslint-with-standard-and-prettier-be245cb9fc64)

### Other Extension

- [pretty-ts-errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors): make TS error message readable

### Local API testing

We use [REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) extension to test the API locally. You can find the API test scripts in `docs/scripts` folder.

### Migrations

Generate new migration file from an entity:

Automatic migration generation creates a new migration file and writes all sql queries that must be executed to update the database.
If no there were no changes generated, the command will exit with code 1.

```
$ npm run typeorm migration:generate ./migrations/{MigrationName}
```

Run migrations:

```
$ npm run typeorm migration:run
```

Reverts last executed migration:

```
$ npm run typeorm migration:revert
```
