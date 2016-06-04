define({ "api": [
  {
    "type": "get",
    "url": "/:questId",
    "title": "Get a Specific Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetQuestid"
  },
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
    "url": "/:username/:questId",
    "title": "Get a Specific Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "GetUsernameQuestid"
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
    "type": "post",
    "url": "/:username/:questId/abandon",
    "title": "Abandon a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestidAbandon"
  },
  {
    "type": "post",
    "url": "/:username/:questId/accept",
    "title": "Accept a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestidAccept"
  },
  {
    "type": "post",
    "url": "/:username/:questId/accept",
    "title": "Complete a Quest",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestidAccept"
  },
  {
    "type": "post",
    "url": "/:username/:questId/progress",
    "title": "Update Quest Progress",
    "group": "Quests",
    "version": "1.0.0",
    "filename": "routes/quests.js",
    "groupTitle": "Quests",
    "name": "PostUsernameQuestidProgress"
  },
  {
    "type": "post",
    "url": "/:username/",
    "title": "Get a User's Profile",
    "group": "Users",
    "version": "1.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "name": "PostUsername"
  },
  {
    "type": "post",
    "url": "/:username/:activities",
    "title": "Get a User's Activities",
    "group": "Users",
    "version": "1.0.0",
    "filename": "routes/users.js",
    "groupTitle": "Users",
    "name": "PostUsernameActivities"
  }
] });
