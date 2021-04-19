#!/bin/bash
npm run build 2> >(tee build-stderr.log)
