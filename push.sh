#!/usr/bin/env bash
# One-time push to GitHub so Vercel can auto-deploy on every later push.
#   ./push.sh https://github.com/<you>/<repo>.git
set -e
[ -z "$1" ] && { echo "usage: ./push.sh <github-repo-url>"; exit 1; }
git remote remove origin 2>/dev/null || true
git remote add origin "$1"
git branch -M main
git push -u origin main
echo "Pushed. Now import the repo at vercel.com/new and add the env vars from .env.example."
