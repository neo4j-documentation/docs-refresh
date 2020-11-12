#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

errors_count=$(cat "$DIR/../build-stderr.log" | grep "asciidoctor: ERROR:" | wc -l)

if [ "$errors_count" != "0" ]; then
  echo "Found ${errors_count} errors, aborting!"
  exit 1
fi

exit 0
