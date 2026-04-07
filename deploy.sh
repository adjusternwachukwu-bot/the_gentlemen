#!/bin/bash

# Navigate to project
cd /Users/milleon/Projects/the-gentlemen

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "The Gents v1 - ready for deployment"

echo "Now go to https://github.com/new to create a repo, then run:"
echo ""
echo "git remote add origin https://github.com/YOUR_USERNAME/the-gentlemen.git"
echo "git push -u origin main"
echo ""
echo "Then connect to Vercel at https://vercel.com"