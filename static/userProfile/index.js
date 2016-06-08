$(function () {
	var questTemplate = $('.quest.template').removeClass('template').remove();
	var actitivtyTemplate = $('.activity.temlate').removeClass('template').remove();
	var questListElement = $('.quest-list');
	var username = location.pathname.replace(/\//g,'');

	fetchQuests()
	.then(buildQuestList);

	fetchActivities()
	.then(buildActivityList);

	function fetchQuests() {
		return $.get(username + '/quests');
	}

	function buildQuestList(quests) {
		if (!quests) {
			return;
		}

		$.each(quests, function (index, quest) {
			var questElement = questTemplate.clone();
			questElement.find('.quest-type').addClass(quest.type);
			questElement.find('.quest-name').text(quest.name);
			questElement.find('.quest-description').text(quest.description);
			questElement.find('.quest-status').text(quest.status);
			questElement.appendTo(questListElement);
		});
	}

	function fetchActivities() {
		return $.get(username + '/activities');
	}

	function buildActivityList(activities) {
		if (!activities) {
			return;
		}

		$.each(activities, function (index, activity) {
			
		});
	}
});
