# APITable
A service turning a spreadsheet into API end points.
APITable is powered by [Skygear][skygear].

## Quick start
### Run the following steps to setup Skygear Cloud Function
### Please note that you have to setup once only
1. `$ cd cloud/dist`
2. `$ git init`
3. `$ git remote add skygear-portal ssh://<your-cloud-code-git-url>`
4. `$ cd ...`

### Deploy cloud code
`$ yarn run deploy:cloud`

### Start the development server
1. `$ mv app/configs.js.example app/configs.js` and edit `app/configs.js` to fill out necessary information accordingly.
2. `$ yarn` or `$ npm install`
3. `$ yarn start` or `$ npm start`
4. You can view the app through `http://localhost:3000`

### Deploy the app to AWS S3
1. Setup your S3 bucket as a static website hosting. Make sure the error page is set to `index.html`.
2. `$ npm run build`
3. Upload files in `./build` to your S3 bucket.

## Documentation
Please read the project's docs [here][apitable-doc]. Update the docs as nessesary in future development.

[skygear]: https://skygear.io
[apitable-doc]: docs/
