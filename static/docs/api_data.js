define({ "api": [
  {
    "type": "get",
    "url": "/quests",
    "title": "Get All Quests",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetQuests"
  },
  {
    "type": "get",
    "url": "/quests/list",
    "title": "Get a list of all quests",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetQuestsList"
  },
  {
    "type": "get",
    "url": "/quests/:questId",
    "title": "Get a Specific Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetQuestsQuestid"
  },
  {
    "type": "get",
    "url": "/:username/quests",
    "title": "Get Quests for User",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetUsernameQuests"
  },
  {
    "type": "get",
    "url": "/:username/quests/:questId",
    "title": "Get a Specific Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetUsernameQuestsQuestid"
  },
  {
    "type": "post",
    "url": "/:username/quests/:questId/abandon",
    "title": "Abandon a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestsQuestidAbandon"
  },
  {
    "type": "post",
    "url": "/:username/quests/:questId/accept",
    "title": "Accept a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestsQuestidAccept"
  },
  {
    "type": "post",
    "url": "/:username/quests/:questId/accept",
    "title": "Complete a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestsQuestidAccept"
  },
  {
    "type": "post",
    "url": "/:username/quests/:questId/progress/:progress",
    "title": "Update Quest Progress",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestsQuestidProgressProgress"
  },
  {
    "type": "get",
    "url": "/completions",
    "title": "Get a count of quest completions",
    "group": "Stats",
    "version": "1.0.0",
    "filename": "routes/stats.js",
    "groupTitle": "Stats",
    "name": "GetCompletions"
  },
  {
    "type": "get",
    "url": "/users",
    "title": "Get a count of users who have progressions",
    "group": "Stats",
    "version": "1.0.0",
    "filename": "routes/stats.js",
    "groupTitle": "Stats",
    "name": "GetUsers"
  },
  {
    "type": "get",
    "url": "/:username/",
    "title": "Get a User's Profile",
    "group": "Users",
    "version": "1.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "name": "GetUsername"
  },
  {
    "type": "get",
    "url": "/:username/:activities",
    "title": "Get a User's Activities",
    "group": "Users",
    "version": "1.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "name": "GetUsernameActivities"
  }
] });
