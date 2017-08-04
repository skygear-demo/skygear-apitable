## APITable Documentation

### Software Stack

- Backend: [Skygear Cloud][skygear]
- Frontend:
  - Rendering: React
  - State Container: Redux
  - Side Effect Model: [redux-saga][redux-saga]
  - Data Model: [Immutable.js][immutable-js]
  - Form Library: [redux-form][redux-form]
  - Type Checker: [Flow][flow]
  - Styling: [Material-UI][material-ui], [styled-components][styled-components]
- Language: JavaScript

### Prerequisites
- git (deploy)
- node (ideally 6.10.0+)

### App Structure
```
app
├── containers (Containers)
├── components (Components)
├── cloud
│   └── functions.js (Skygear Cloud Functions)
└── utils (Utility Functions)
```

### Conventions
- Group containers/components by folder
	- Files in a container/component folder (*optional)
		- index.js (Component Definition)
		- actions.js (Action Creators)*
		- constants.js (Types of Action Creators)*
		- reducer.js (Redux Reducer)*
- Use Flow instead of PropTypes
- Use ImmutableJS in Redux Store

### Async Flow
This project uses [redux-saga] to handle side effects (e.g async requests, skygear db calls).

These are steps to make async requests:
1. Modify `app/routes.js` to inject your sagas (usually located at `container/*/sagas.js`)
2. Dispatch your action that triggers async operations (e.g `FETCH_TABLE_LIST`)
3. Async operations are handled inside your watcher on `sagas.js`

To learn more about redux-saga, [Click here][redux-saga-docs] to read the official docs.

### Skygear
This project uses [Skygear][skygear] to handle all back end operations (e.g Authentication, Database).

To achieve customizations (e.g data validation, custom end points), Skygear Cloud Function is provided to run JavaScript codes on the cloud. Codes/Functions are triggered when needed. To learn more, [Click here][skygear-cloud] to read the official docs.

In this project, all cloud functions are defined in `cloud/functions.js`.

#### Deploying Cloud Functions
1. As it is written in ES6, you have to run `yarn run build:cloud` to transpile it to ES5.
2. Run `$ yarn run deploy:cloud`, all deploy procedures are done automatically. Make sure you have installed `git`.

[skygear]: https://skygear.io
[skygear-cloud]: https://docs.skygear.io/guides/cloud-function/intro-and-deployment/python
[redux-saga]: https://github.com/redux-saga/redux-saga
[redux-saga-docs]: https://redux-saga.js.org/docs/introduction/BeginnerTutorial.html
[redux-form]: https://redux-form.com
[immutable-js]: https://facebook.github.io/immutable-js
[styled-components]: https://github.com/styled-components/styled-components
[flow]: https://flow.org
[material-ui]: http://www.material-ui.com
