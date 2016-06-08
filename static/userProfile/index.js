$(function () {
	var questTemplate = $('.quest.template').removeClass('template').remove();
	var actitivtyTemplate = $('.activity.template').removeClass('template').remove();
	var questListElement = $('.quest-list');
	var activityListElement = $('.activity-list');
	var username = location.pathname.replace(/\//g,'');
	$('.prepend-username').prepend(username + '\'s ');

	fetchQuests()
	.then(buildQuestList);

	fetchActivities()
	.then(buildActivityList);

	function fetchQuests() {
		return $.get('quests');
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
		return $.get('activities');
	}

	function buildActivityList(activities) {
		if (!activities || !activities.length) {
			activityListElement.text('None');
		}

		$.each(activities, function (index, activity) {
			var activityElement = actitivtyTemplate.clone();
			activityElement.find('.activity-action').addClass(activity.action).text(formatAction(activity.action));
			activityElement.find('.activity-quest-name').text((activity.quest && activity.quest.name) || 'Unnamed Quest');
			activityElement.find('.activity-date').text(moment(activity.date).fromNow());
			activityElement.appendTo(activityListElement);
		});
	}
	
	function formatAction(action) {
		return actionMap[action] || action;
	}
	
	var actionMap = {
		accept: 'Accepted',
		abandon: 'Abandoned',
		complete: 'Completed',
		progress: 'Progressed'
	};
});
