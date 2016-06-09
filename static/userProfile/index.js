$(function () {
	var questTemplate = $('.quest.template').removeClass('template').remove();
	var actitivtyTemplate = $('.activity.template').removeClass('template').remove();
	var questListElement = $('.quest-list').hide();
	var activityListElement = $('.activity-list').hide();
	var characterRender = $('.character-render').hide();
	var username = location.pathname.replace(/\//g,'');
	$('.profile-name').text(username.toUpperCase());

	fetchQuests()
	.then(buildQuestList);

	fetchActivities()
	.then(buildActivityList);
	
	setupCharacterRender();

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
			if (quest.progress && quest.status === 'accepted') {
				questElement.find('.quest-status').text(quest.progress + ' of ' + quest.target.quantity + ' ' + formatQuestType(quest.type));
			} else {
				questElement.find('.quest-status').text(formatQuestStatus(quest.status));
			}
			questElement.find('.quest-progress-bar').width(Math.round(100 * (quest.progress || 0) / quest.target.quantity) + '%');
			questElement.appendTo(questListElement);
		});
		questListElement.show();
	}

	function formatQuestType(type) {
		return questTypeMap[type] || type;
	}

	var questTypeMap = {
		'hunt': 'Killed',
		'gather': 'Gathered'
	};

	function formatQuestStatus(status) {
		return questStatusMap[status] || status;
	}

	var questStatusMap = {
		available: 'Available',
		accepted: 'Accepted',
		complete: 'Complete'
	};

	function fetchActivities() {
		return $.get('activities');
	}

	function buildActivityList(activities) {
		if (!activities || !activities.length) {
			activityListElement.append('No recent activity');
		}

		$.each(activities, function (index, activity) {
			var activityElement = actitivtyTemplate.clone();
			activityElement.find('.activity-action').addClass(activity.action).text(formatAction(activity.action));
			activityElement.find('.activity-quest-name').text((activity.quest && activity.quest.name) || 'Unnamed Quest');
			activityElement.find('.activity-date').text(moment(activity.date).fromNow());
			activityElement.appendTo(activityListElement);
		});
		activityListElement.show();
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
	
	function setupCharacterRender() {
		characterRender.attr('src','https://crafatar.com/renders/body/' + username + '?overlay&scale=5').show();
	}
});
