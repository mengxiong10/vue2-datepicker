#!/bin/bash

# Check current branch
if test "master" != "$(git symbolic-ref --short HEAD)"; then
  echo 'Not on `master` branch.' >&2;
  exit 128;
fi


# Check local working tree
if test -n "$(git status --porcelain)"; then
  echo 'Unclean working tree. Commit or stash changes first.' >&2;
  exit 128;
fi

# Check remote history
if test "0" != "$(git rev-list --count --left-only @'{u}'...HEAD)"; then
  echo 'Remote history differ. Please pull changes.' >&2;
  exit 128;
fi
