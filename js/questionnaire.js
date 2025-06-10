class QuestionnaireManager {
    constructor() {
        this.questionnaire = new Questionnaire();
        this.currentBlockIndex = -1;
        this.currentQuestionIndex = -1;
    }

    // Block management
    addBlock(title) {
        const block = new Block({ title });
        this.questionnaire.addBlock(block);
        return this.questionnaire.blocks.length - 1;
    }

    removeBlock(index) {
        this.questionnaire.removeBlock(index);
        if (this.currentBlockIndex === index) {
            this.currentBlockIndex = -1;
        } else if (this.currentBlockIndex > index) {
            this.currentBlockIndex--;
        }
    }

    moveBlock(fromIndex, toIndex) {
        this.questionnaire.moveBlock(fromIndex, toIndex);
        if (this.currentBlockIndex === fromIndex) {
            this.currentBlockIndex = toIndex;
        }
    }

    updateBlockTitle(index, title) {
        const block = this.questionnaire.getBlock(index);
        if (block) {
            block.title = title;
        }
    }

    // Question management
    addQuestion(blockIndex, questionData) {
        const block = this.questionnaire.getBlock(blockIndex);
        if (block) {
            const question = new Question(questionData);
            block.questions.push(question);
            return block.questions.length - 1;
        }
        return -1;
    }

    updateQuestion(blockIndex, questionIndex, questionData) {
        const block = this.questionnaire.getBlock(blockIndex);
        if (block && block.questions[questionIndex]) {
            block.questions[questionIndex] = new Question(questionData);
        }
    }

    removeQuestion(blockIndex, questionIndex) {
        const block = this.questionnaire.getBlock(blockIndex);
        if (block) {
            block.questions.splice(questionIndex, 1);
        }
    }

    moveQuestion(blockIndex, fromIndex, toIndex) {
        const block = this.questionnaire.getBlock(blockIndex);
        if (block) {
            const question = block.questions.splice(fromIndex, 1)[0];
            block.questions.splice(toIndex, 0, question);
        }
    }

    // Export functions
    exportToEQuest2() {
        return this.questionnaire.toEQuest2();
    }

    exportToEQuest3() {
        return this.questionnaire.toEQuest3();
    }

    // Save and load
    saveToLocalStorage() {
        const data = {
            title: this.questionnaire.title,
            description: this.questionnaire.description,
            questionnaireVersion: this.questionnaire.questionnaireVersion,
            blocks: this.questionnaire.blocks.map(block => ({
                title: block.title,
                questions: block.questions.map(q => ({
                    type: q.type,
                    id: q.id,
                    title: q.title,
                    behavior: q.behavior,
                    media: q.media,
                    Options: q.Options,
                    OpOther: q.OpOther,
                    replication: q.replication,
                    reference: q.reference,
                    size: q.size,
                    allowOnlyNumbers: q.allowOnlyNumbers,
                    showDontKnow: q.showDontKnow,
                    showDontAnswer: q.showDontAnswer,
                    showDontApply: q.showDontApply,
                    dependencies: q.dependencies
                }))
            }))
        };
        localStorage.setItem('questionnaire', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('questionnaire');
        if (data) {
            const parsedData = JSON.parse(data);
            this.questionnaire = new Questionnaire(parsedData);
            return true;
        }
        return false;
    }

    // Navigation
    setCurrentBlock(index) {
        if (index >= -1 && index < this.questionnaire.blocks.length) {
            this.currentBlockIndex = index;
            this.currentQuestionIndex = -1;
            return true;
        }
        return false;
    }

    setCurrentQuestion(blockIndex, questionIndex) {
        const block = this.questionnaire.getBlock(blockIndex);
        if (block && questionIndex >= -1 && questionIndex < block.questions.length) {
            this.currentBlockIndex = blockIndex;
            this.currentQuestionIndex = questionIndex;
            return true;
        }
        return false;
    }

    getCurrentBlock() {
        return this.currentBlockIndex >= 0 ? this.questionnaire.getBlock(this.currentBlockIndex) : null;
    }

    getCurrentQuestion() {
        const block = this.getCurrentBlock();
        return block && this.currentQuestionIndex >= 0 ? block.questions[this.currentQuestionIndex] : null;
    }
} 