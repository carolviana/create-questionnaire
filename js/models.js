class Question {
    constructor(data = {}) {
        this.type = data.type || 'text';
        this.id = data.id || '';
        this.title = data.title || '';
        this.behavior = data.behavior || '';
        this.media = data.media || '';
        this.Options = data.Options || {};
        this.OpOther = data.OpOther || '';
        this.replication = data.replication || '';
        this.reference = data.reference || '';
        this.size = data.size || '';
        this.allowOnlyNumbers = data.allowOnlyNumbers || false;
        this.showDontKnow = data.showDontKnow || false;
        this.showDontAnswer = data.showDontAnswer || false;
        this.showDontApply = data.showDontApply || false;
        this.dependencies = data.dependencies || [];
        this.isExpanded = data.isExpanded || false;
    }

    toEQuest2() {
        const eQuest2Question = {
            type: this.type,
            id: this.id,
            title: this.title,
            behavior: this.behavior,
            allowOnlyNumbers: this.allowOnlyNumbers,
            size: this.size,
            replication: this.replication,
            reference: this.reference,
            showDontKnow: this.showDontKnow,
            showDontAnswer: this.showDontAnswer,
            showDontAllow: this.showDontApply,
            dependencies: this.dependencies
        };

        // Convert Options object to Op1, Op2, etc.
        Object.entries(this.Options).forEach(([key, value], index) => {
            eQuest2Question[`Op${index + 1}`] = value;
        });

        if (this.OpOther) {
            eQuest2Question.OpOther = this.OpOther;
        }

        return eQuest2Question;
    }

    toEQuest3() {
        return {
            type: this.type,
            id: this.id,
            title: this.title,
            behavior: this.behavior,
            media: this.media,
            Options: this.Options,
            OpOther: this.OpOther,
            replication: this.replication,
            reference: this.reference,
            size: this.size,
            allowOnlyNumbers: this.allowOnlyNumbers,
            showDontKnow: this.showDontKnow,
            showDontAnswer: this.showDontAnswer,
            showDontAply: this.showDontApply,
            dependencies: this.dependencies
        };
    }
}

class BlockVersion {
    constructor(block, comment = '') {
        this.timestamp = new Date();
        this.block = JSON.parse(JSON.stringify(block)); // Deep copy
        this.comment = comment;
    }
}

class Block {
    constructor(title = '') {
        this.id = crypto.randomUUID();
        this.title = title;
        this.questions = [];
        this.versions = [];
        this.color = '#ffffff'; // Cor padrão branca
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.isExpanded = true;
    }

    addQuestion(question) {
        this.questions.push(question);
        this.saveVersion('Adição de pergunta');
    }

    moveQuestionUp(questionId) {
        const index = this.questions.findIndex(q => q.id === questionId);
        if (index > 0) {
            // Troca a pergunta com a anterior
            [this.questions[index - 1], this.questions[index]] = [this.questions[index], this.questions[index - 1]];
            this.saveVersion('Reordenação de pergunta para cima');
            return true;
        }
        return false;
    }

    moveQuestionDown(questionId) {
        const index = this.questions.findIndex(q => q.id === questionId);
        if (index < this.questions.length - 1) {
            // Troca a pergunta com a próxima
            [this.questions[index], this.questions[index + 1]] = [this.questions[index + 1], this.questions[index]];
            this.saveVersion('Reordenação de pergunta para baixo');
            return true;
        }
        return false;
    }

    removeQuestion(questionId) {
        this.questions = this.questions.filter(q => q.id !== questionId);
        this.updatedAt = new Date();
    }

    updateComplexity() {
        const questionCount = this.questions.length;
        const hasDependencies = this.questions.some(q => q.dependencies && q.dependencies.length > 0);
        const hasComplexTypes = this.questions.some(q => ['multiple', 'matrix'].includes(q.type));

        if (questionCount > 10 || (hasDependencies && hasComplexTypes)) {
            this.complexity = 'high';
        } else if (questionCount > 5 || hasDependencies || hasComplexTypes) {
            this.complexity = 'medium';
        } else {
            this.complexity = 'low';
        }
    }

    duplicate(maintainDependencies = true) {
        const newBlock = new Block(this.title);
        newBlock.color = this.color;
        newBlock.questions = this.questions.map(q => {
            const newQuestion = { ...q };
            newQuestion.id = crypto.randomUUID();
            if (!maintainDependencies) {
                newQuestion.dependencies = [];
            }
            return newQuestion;
        });
        newBlock.updateComplexity();
        return newBlock;
    }

    saveVersion(comment = '') {
        this.versions.push(new BlockVersion(this, comment));
    }

    revertToVersion(versionIndex) {
        if (versionIndex >= 0 && versionIndex < this.versions.length) {
            const version = this.versions[versionIndex];
            Object.assign(this, version.block);
            this.updatedAt = new Date();
        }
    }

    getProgress() {
        if (this.questions.length === 0) return 0;
        const completedQuestions = this.questions.filter(q => 
            q.title && q.type && q.id
        ).length;
        return Math.round((completedQuestions / this.questions.length) * 100);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            color: this.color,
            questions: this.questions,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    static fromJSON(json) {
        const block = new Block(json.title);
        block.id = json.id;
        block.color = json.color || '#ffffff';
        block.questions = json.questions;
        block.createdAt = new Date(json.createdAt);
        block.updatedAt = new Date(json.updatedAt);
        return block;
    }

    toEQuest2() {
        const eQuest2Block = {};
        eQuest2Block[this.title] = this.questions.map(q => q.toEQuest2());
        return eQuest2Block;
    }

    toEQuest3() {
        return {
            title: this.title,
            questions: this.questions.map(q => q.toEQuest3())
        };
    }
}

class Questionnaire {
    constructor(data = {}) {
        this.title = data.title || '';
        this.description = data.description || '';
        this.questionnaireVersion = data.questionnaireVersion || '';
        this.blocks = (data.blocks || []).map(b => new Block(b));
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    toEQuest2() {
        return this.blocks.map(block => block.toEQuest2());
    }

    toEQuest3() {
        return {
            title: this.title,
            description: this.description,
            questionnaireVersion: this.questionnaireVersion,
            blocks: this.blocks.map(block => block.toEQuest3())
        };
    }

    addBlock(block) {
        const blockNumber = this.blocks.length + 1;
        const newBlock = new Block(`Bloco ${blockNumber}`);
        if (block) {
            Object.assign(newBlock, block);
        }
        this.blocks.push(newBlock);
        this.updatedAt = new Date();
        return newBlock;
    }

    removeBlock(index) {
        this.blocks.splice(index, 1);
        this.updatedAt = new Date();
    }

    moveBlock(fromIndex, toIndex) {
        const block = this.blocks.splice(fromIndex, 1)[0];
        this.blocks.splice(toIndex, 0, block);
        this.updatedAt = new Date();
    }

    getBlock(blockId) {
        return this.blocks.find(block => block.id === blockId);
    }

    updateBlock(index, blockData) {
        this.blocks[index] = new Block(blockData);
        this.updatedAt = new Date();
    }

    getStatistics() {
        return {
            totalBlocks: this.blocks.length,
            totalQuestions: this.blocks.reduce((sum, block) => sum + block.questions.length, 0),
            averageQuestionsPerBlock: this.blocks.length ? 
                this.blocks.reduce((sum, block) => sum + block.questions.length, 0) / this.blocks.length : 0,
            blocksByType: this.blocks.reduce((acc, block) => {
                acc[block.type] = (acc[block.type] || 0) + 1;
                return acc;
            }, {}),
            blocksByComplexity: this.blocks.reduce((acc, block) => {
                acc[block.complexity] = (acc[block.complexity] || 0) + 1;
                return acc;
            }, {})
        };
    }

    exportBlock(blockId) {
        const block = this.getBlock(blockId);
        if (block) {
            return JSON.stringify(block.toJSON(), null, 2);
        }
        return null;
    }

    importBlock(jsonString) {
        try {
            const blockData = JSON.parse(jsonString);
            const block = Block.fromJSON(blockData);
            this.addBlock(block);
            return true;
        } catch (error) {
            console.error('Error importing block:', error);
            return false;
        }
    }
} 