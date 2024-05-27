### Ngx-Admin Angular 14 application from akveo.com

This is modified and more lightweight version of original application to practice UI Automation with Playwright.

The original repo is here: https://github.com/akveo/ngx-admin

Application from Udemy course https://github.com/bondar-artem/pw-practice-app

Install:
- node js
- git
- Playwright extension
> npm install --force

Compile the application used to test:
> npm start
url: http://localhost:4200/pages/iot-dashboard

Playwright commands:
> npm init playwright@latest --force
> npx playwright test -- ui
>

Install data generator library
> npm i @faker-js/faker --save-dev --force

ENV variables:
> npm i dotenv --save-dev --force

Run tests by tag
> npx playwright test --project=chromium --grep smoke
> npx playwright test --project=chromium --grep "block^smoke"

Allure report
Install in windows:
> iwr -useb get.scoop.sh | iex (Powershell)
> scoop install allure
Install package
> npm i -D @playwright/test allure-playwright --force
> npm install -g allure-commandline --save-dev
Generate Allure Report:
> allure generate allure-results -o allure-report --clean

Visual comparision with screenshots
> npx playwright test --update-snapshots    //run all tests and snapshots are going to be updated

Docker
> docker build -t pw-pageobject-test .
> docker images
> docker run -it pw-pageobject-test
run the test in package.json:
> npm run pageObjects-chrome
exit from container in the console ctrl + d

run docker compose
> docker-compose up --build
