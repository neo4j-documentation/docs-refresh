#!/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

missing_attributes=$(cat "$DIR/../build-stderr.log" | grep "skipping reference to missing attribute" | cut -d' ' -f8)
missing_attributes_list=$(echo $missing_attributes | tr '\n' ' ')
read -a missing_attributes_array <<< $missing_attributes_list

if [ ! -z "$missing_attributes" ]; then
  echo "Found ${#missing_attributes_array[@]} unresolved attributes"
  uniq_missing_attributes=$(echo "$missing_attributes" | sort | uniq)
  for missing_attr in $uniq_missing_attributes
  do
    echo "Unresolved attribute {$missing_attr} found in:"
    grep -i "{$missing_attr}" "$DIR/../build/site/"* -R | cut -d':' -f1 | uniq | sed -e "s/^.*\/build\/site\///" | sed -e 's/^/  /'
  done
  exit 1
fi

exit 0
