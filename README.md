# vcl-info-site

## Description
vcl-info-site is a website project to consolidate most of the data on the Vertex Control League seasons in one easily navigatable place.
The reason to have this website is to improve on how scattered information in the VCL discord is, to pretify the data and to make available data that wasn't really available in the discord.

Since it's a private project and everybody be working day jobs, it is meant to be limited in a few ways to cut down on time and effort:
- the site is designed on and for 1080p 16:9 computer monitors only
- all data is read only
- no player accounts
- no querying data beyond the standard views

Any future versions might improve on the limitations, but the very first version will be in the described limited form.

## Installation
npm install

## Compilation
Compilation is using PKG ( https://www.npmjs.com/package/pkg )
* npm install -g pkg
* open terminal
* go to project folder where package.json is
* execute command "pkg ."
* go to ./project_root/dist/ for compiled softwares

## Administration
### Data structure
The site does not use a proper database, but uses a number of files instead. Most of the are .json files, some of them are .csv files.

There are a few files which are used throughout the site:
- players.json -> master data on all players in the VCL
- season.json -> master data on all seasons
- maps.json -> master data on all maps
- playerAliases.json -> correlation between player alias and play entry in players.json

Other files are specific to an individual season:
- schedule.json -> match table that contains the list of _all_ matches of a season
- teams.json -> list of teams participating in a season
- teamAliases.json -> correlation between team alias and team entry in players.json

Ontop of season-specific files, there's one "match-results.json" or "match-results.csv" per finished match in every match folder.
"match-results.csv" are results files in the form that Guglimugli defined.