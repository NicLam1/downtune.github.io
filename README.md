#App url
https://downtune.netlify.app

#Git Repo
https://github.com/NicLam1/downtune.github.io

#Instructions
npm install
(If doesn't work then)
npm install --legacy-peer-deps

#Notes
Stuff not mentioned in presentation:

1. (Home Page) Genres selected from other genres dropdown get turned into a pill in the main genres section. Stays as a pill when deselected.
2. (Home Page) Filters + page number are stored in sessionStorage when navigating the page, when returning to home screen, filters stay the same
3. (Home Page) Content of band pages are pre-loaded when user hovers over page into a cache, so clicking and loading into a band profile is faster
4. (Band Profile Page) Featured artist is based on the genres of the selected band, Reccomended artists are reccomended artists of the featured artist
5. (Account Page) When logged in, user can view account details, user can change their band preferences, login details & display name
