require('shelljs/global');

if (!test('-e', 'cloud/dist/index.js')) {
  echo('Please run `npm run build:cloud` to build your cloud code first.');
  exit(1);
}

cd('cloud/dist');

if (exec('git add . && git commit --allow-empty -m "Deploy"').code !== 0) {
  echo('\nError: Git commit failed');
  exit(1);
}

if (exec('git push skygear-portal master -f').code !== 0) {
  echo('\nError: Git push failed, please make sure you have configured your skygear-portal git remote url correctly.');
  exit(1);
}
