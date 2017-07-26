require('shelljs/global');

cp('-R', 'cloud/node_modules', 'cloud/dist/node_modules');

echo('\nCopy node_modules done.');
