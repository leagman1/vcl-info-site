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

## Information & Administration
### Data structure
The site does not use a proper database, but uses a number of files instead. Most of them are .json files, some of them are .csv files.
For info on the structure of an individual file, refer to the existing files.

There are a few files which are used throughout the site:
- players.json -> master data on all players in the VCL
- season.json -> master data on all seasons
- maps.json -> master data on all maps
- playerAliases.json -> correlation between player alias and player entry in players.json

Other files are specific to an individual season:
- schedule.json -> match table that contains the list of _all_ matches of a season
- teams.json -> list of teams participating in a season
- teamAliases.json -> correlation between team alias and team entry in players.json

Ontop of season-specific files, there's one "match-results.json" or "match-results.csv" per finished match in every match folder.
"match-results.csv" are results files in the form that Guglimugli defined.

### Adding a new player to master data
1. Open data/players.json
2. Search the file to make sure the player is not in the list yet
3. Add a new entry at the bottom of the list with the following properties:
    - "id": [Number, new player ID, unique]
    - "name": [String]

### Adding a new map to master data
1. Open data/maps.json
2. Search the file to make sure the map is not in the list yet
3. Add a new entry at the bottom of the list with the following properties:
    - "id": [Number, new map ID, unique],
    - "name": [String],
    - "creator": [String],
    - "portedBy": [Number, player ID from players.json],
    - "image": [String, filename of the thumbnail in public/img],
    - "source": [String, URL to download location, i.e. vertex.mod.io]

### Creating a new season
To create a new season, follow these steps:

1. Create the folder structure for the season:
    - Season [Number, ascending from last season]
        - Match data
            - Week [Number, according to schedule.json, starting at 1]
                - Match [Number, according to schedule, starting at 1]
                - ..repeat Match
            - ..repeat Week till end of schedule.json
2. Add all necessary files:
    - teams.json
    - schedule.json
    - teamAliases.json
3. Add a season entry to data/season.json

### Creating a schedule for a season
```json
{"test": "test"}
```

### Creating a new team
1. Open a teams.json file
2. Add a new entry with the following properties:
    - "id": [Number, new team ID, unique],
    - "name": [String],
    - "tag": [String],
    - "members": [Array of player IDs from players.json],
    - "captain": [Number, player ID from players.json],
    - "secondInCommand": [Number, player ID from players.json]