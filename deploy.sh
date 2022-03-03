#!/bin/sh

set -e
set -x

SOURCE_FILE="build/*"
GIT_SERVER="github.com"
OUTPUT_BRANCH="main"
DESTINATION_REPO="OmarQurashi868/polly"

CLONE_DIR=$(mktemp -d)

echo "Cloning destination git repository"
git config --global user.email "build@build.build"
git config --global user.name "github-actions"
git clone --single-branch --branch $OUTPUT_BRANCH "https://x-access-token:$API_TOKEN_GITHUB@$GIT_SERVER/$DESTINATION_REPO.git" "$CLONE_DIR"

echo "Copying contents to git repo"
rsync -avrh "$SOURCE_FILE" "$CLONE_DIR"

cd "$CLONE_DIR"
COMMIT_MESSAGE="Update from https://$GIT_SERVER/${GITHUB_REPOSITORY}/commit/${GITHUB_SHA}"

echo "Adding git commit"
git add .
if git status | grep -q "Changes to be committed"
then
  git commit --message "$COMMIT_MESSAGE"
  echo "Pushing git commit"
  git push -u origin HEAD:"$OUTPUT_BRANCH"
else
  echo "No changes detected"
fi
