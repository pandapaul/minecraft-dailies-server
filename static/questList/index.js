var minecraftItems = require('minecraft-items')

/* global $ */
$(function () {
  var questTemplate = $('.quest.template').removeClass('template').remove()
  var questListElement = $('.quest-list')
  var questCount = $('.total-quest-count')

  fetchQuests()
    .then(buildQuestList)

  function fetchQuests () {
    return $.get('quests/list')
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

    questCount.text(quests.length)

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
})
