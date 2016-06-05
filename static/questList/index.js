$(function () {
    var questTemplate = $('.quest.template').removeClass('template').remove();
    var questListElement = $('.quest-list');

    fetchQuests()
    .then(buildQuestList);

    function fetchQuests() {
        return $.get('quests/list');
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
            questElement.appendTo(questListElement);
        });
    }
});
