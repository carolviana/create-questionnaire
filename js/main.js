document.addEventListener('DOMContentLoaded', () => {
    const questionnaireManager = new QuestionnaireManager();
    window.questionnaireManager = questionnaireManager;
    const ui = new QuestionnaireUI(questionnaireManager);
    questionnaireManager.ui = ui;
}); 