// These are the pages you can go to.
// They are all wrapped in the App component, which should contain the navbar etc
// See http://blog.mxstbr.com/2016/01/react-apps-with-pages for more information
// about the code splitting business
import { getAsyncInjectors } from 'utils/asyncInjectors';

async function toDefaultRoute(nextState, replace, callback) {
  const skygear = await import('skygear');
  const loggedIn = !!skygear.currentUser;

  if (loggedIn) {
    replace('/tables');
  }
  callback();
}

const getNextRoute = (loggedIn, nextPath) => {
  const authRoutes = ['/account/login', '/account/register'];
  const isAuthRoute = authRoutes.includes(nextPath);

  if ((loggedIn && !isAuthRoute) || (!loggedIn && isAuthRoute)) {
    return nextPath;
  }

  return loggedIn ? '/tables' : authRoutes[0];
};

async function checkAuth(nextState, replace, callback) {
  const skygear = await import('skygear');
  const loggedIn = !!skygear.currentUser;
  const nextPath = nextState.location.pathname;
  const nextRoute = getNextRoute(loggedIn, nextPath);

  if (nextRoute !== nextPath) {
    replace(nextRoute);
  }
  callback();
}

async function authLogout(nextState, replace, callback) {
  const skygear = await import('skygear');
  await skygear.logout();
  replace('/account/login');
  callback();
}

const errorLoading = (err) => {
  console.error('Dynamic page loading failed', err); // eslint-disable-line no-console
};

const loadModule = (cb) => (componentModule) => {
  cb(null, componentModule.default);
};

export default function createRoutes(store) {
  // Create reusable async injectors using getAsyncInjectors factory
  const { injectReducer, injectSagas } = getAsyncInjectors(store); // eslint-disable-line no-unused-vars

  return [
    {
      path: '/',
      name: 'home',
      onEnter: toDefaultRoute,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('components/Landing'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([component]) => {
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/account/login',
      name: 'loginPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('redux-form/immutable'),
          import('containers/Account/Login/sagas'),
          import('containers/Account/Login'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reduxForm, sagas, component]) => {
          injectReducer('form', reduxForm.reducer);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/account/register',
      name: 'registerPage',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('redux-form/immutable'),
          import('containers/Account/Register/sagas'),
          import('containers/Account/Register'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reduxForm, sagas, component]) => {
          injectReducer('form', reduxForm.reducer);
          injectSagas(sagas.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/account/logout',
      name: 'logoutPage',
      onEnter: authLogout,
    }, {
      path: '/tables',
      name: 'tables',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('redux-form/immutable'),
          import('containers/Table/List/sagas'),
          import('containers/Table/actions'),
          import('containers/Table/reducer'),
          import('containers/Table/List'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reduxForm, sagas, actions, reducer, component]) => {
          injectReducer('form', reduxForm.reducer);
          injectSagas(sagas.default);
          store.dispatch(actions.loadTableList());
          injectReducer('table', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '/tables/:id',
      name: 'tables',
      onEnter: checkAuth,
      getComponent(nextState, cb) {
        const importModules = Promise.all([
          import('redux-form/immutable'),
          import('containers/Table/Edit/sagas'),
          import('containers/Table/actions'),
          import('containers/Table/reducer'),
          import('containers/Table/Edit'),
        ]);

        const renderRoute = loadModule(cb);

        importModules.then(([reduxForm, sagas, actions, reducer, component]) => {
          injectReducer('form', reduxForm.reducer);
          injectSagas(sagas.default);
          store.dispatch(actions.loadTableRecords(nextState.params.id));
          injectReducer('table', reducer.default);
          renderRoute(component);
        });

        importModules.catch(errorLoading);
      },
    }, {
      path: '*',
      name: 'notfound',
      getComponent(nextState, cb) {
        import('containers/NotFoundPage')
          .then(loadModule(cb))
          .catch(errorLoading);
      },
    },
  ];
}
