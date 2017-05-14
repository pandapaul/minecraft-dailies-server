var minecraftItems = require('minecraft-items')

/* global $ io moment */
$(function () {
  'use strict'
  var userSearch = $('.user-search input')
    .focus()
    .keyup(handleSearchKeyup)
  var questTemplate = $('.quest.template').removeClass('template').remove()
  var actitivtyTemplate = $('.activity.template').removeClass('template').remove()
  var activityListElement = $('.activity-list')
  var questListElement = $('.quest-list')
  var statsDisplay = $('.stats').hide()
  var statsCompletions = statsDisplay.find('.quest-completions-count')
  var statsUsers = statsDisplay.find('.users-count')
  var socket = io()

  fetchQuests()
    .then(buildQuestList)

  fetchStats()
    .then(showStats)

  fetchActivities()
    .then(buildActivityList)

  socket.on('quest activity', logActivityStream)

  setInterval(updateTimestamps, 30000)

  function updateTimestamps () {
    activityListElement.find('.activity').each(function (i, activityElement) {
      activityElement = $(activityElement)
      activityElement.find('.activity-date').text(activityElement.data('date').fromNow())
    })
  }

  function fetchActivities () {
    return $.get('activities')
  }

  function buildActivityList (activities) {
    if (!activities) {
      return
    }
    $.each(activities, function (index, activity) {
      normalizeActivityDate(activity)
      buildActivityLog(activity).appendTo(activityListElement)
    })
    activityListElement.show()
  }

  function normalizeActivityDate (activity) {
    var now = moment()
    activity.date = moment(activity.date)
    if (activity.date > now) {
      activity.date = now
    }
  }

  function buildActivityLog (activity) {
    var activityElement = actitivtyTemplate.clone()
    activityElement.find('.activity-avatar').attr('src', 'https://crafatar.com/avatars/' + activity.username + '?overlay&size=25')
    activityElement.find('.activity-username').text(activity.username)
    activityElement.find('.activity-action').addClass(activity.action).text(formatAction(activity.action))
    activityElement.find('.activity-quest-name').text((activity.quest && activity.quest.name) || 'Unnamed Quest')
    activityElement.find('.activity-date').text(activity.date.fromNow())
    activityElement.find('a.user-profile-link').attr('href', activity.username)
    activityElement.data('date', activity.date)
    return activityElement
  }

  function logActivityStream (activity) {
    activityListElement.find('.activity').last().remove()
    normalizeActivityDate(activity)
    buildActivityLog(activity).prependTo(activityListElement)
  }

  function formatAction (action) {
    return actionMap[action] || action
  }

  var actionMap = {
    accept: 'accepted',
    abandon: 'abandoned',
    complete: 'completed',
    progress: 'progressed'
  }

  function fetchQuests () {
    return $.get('quests?modVersion=9000.0.0-9000')
  }

  function getRewardItem (quest) {
    var id = quest.reward.type + ':' + (quest.reward.subType || '0')
    return minecraftItems.get(id)
  }

  function dataUri (data) {
    return 'data:image/png;base64,' + data
  }

  function buildQuestList (quests) {
    if (!quests) {
      return
    }

    $.each(quests, function (index, quest) {
      var questElement = questTemplate.clone()
      var rewardItem = getRewardItem(quest)
      var rewardIconElement = questElement.find('.quest-reward-icon')
      questElement.find('.quest-type').addClass(quest.type)
      questElement.find('.quest-name').text(quest.name)
      questElement.find('.quest-description').text(quest.description)
      questElement.find('.quest-reward-quantity').text(quest.reward.quantity)
      rewardIconElement.attr('src', dataUri(rewardItem.icon))
      rewardIconElement.attr('title', rewardItem.name)
      questElement.appendTo(questListElement)
    })
  }

  function handleSearchKeyup (event) {
    if (event.which === 13) {
      search()
    }
  }

  function search () {
    window.location.pathname = '/' + userSearch.val()
  }

  function fetchStats () {
    return $.when(fetchCompletions(), fetchUsers())
  }

  function fetchCompletions () {
    return $.get('stats/completions').done(function (count) {
      statsCompletions.text(count)
    })
  }

  function fetchUsers () {
    return $.get('stats/users').done(function (count) {
      statsUsers.text(count)
    })
  }

  function showStats () {
    statsDisplay.show()
  }
})
