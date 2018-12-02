#!/bin/bash

npm run build-ts
stat dist || mkdir dist
zip dist/mutt-fipe-updater.zip -r dist package.json package-lock.json
eb deploy