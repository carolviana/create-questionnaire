class QuestionnaireUI {
    constructor(questionnaireManager) {
        console.log('[UI] QuestionnaireUI inicializado.');
        this.questionnaireManager = questionnaireManager;
        this.currentBlockId = null;
        this.currentQuestionId = null;
        this.initializeElements();
        this.attachEventListeners();
        this.setupKeyboardShortcuts();
        this.render();
        this.initializeQuestionnaireImport();
    }

    initializeElements() {
        // Metadata
        this.titleInput = document.getElementById('questionnaireTitle');
        this.descriptionInput = document.getElementById('questionnaireDescription');
        this.versionInput = document.getElementById('questionnaireVersion');

        // Blocks
        this.blocksTree = document.getElementById('blocksTree');
        this.addBlockBtn = document.getElementById('addBlockBtn');
        this.importBlockBtn = document.getElementById('importBlockBtn');
        this.blocksStats = {
            totalBlocks: document.getElementById('totalBlocks'),
            totalQuestions: document.getElementById('totalQuestions')
        };

        // Block Editor
        this.blockEditor = document.getElementById('blockEditor');
        this.blockTitleInput = document.getElementById('blockTitle');
        this.colorButtons = document.querySelectorAll('.color-btn');
        this.duplicateBlockBtn = document.getElementById('duplicateBlockBtn');
        this.exportBlockBtn = document.getElementById('exportBlockBtn');
        this.blockHistoryBtn = document.getElementById('blockHistoryBtn');
        this.saveBlockBtn = document.getElementById('saveBlockBtn');
        this.deleteBlockBtn = document.getElementById('deleteBlockBtn');
        this.expandAllQuestionsBtn = document.getElementById('expandAllQuestionsBtn');
        this.collapseAllQuestionsBtn = document.getElementById('collapseAllQuestionsBtn');

        // Questions
        this.questionsList = document.getElementById('questionsList');
        this.addQuestionBtn = document.getElementById('addQuestionBtn');

        // Inline Question Form
        this.questionForm = document.getElementById('questionForm');
        this.questionFormElement = document.getElementById('questionFormElement');
        this.cancelQuestionBtn = document.getElementById('cancelQuestionBtn');
        this.lastEditedQuestionElement = null;

        // Modals
        this.blockHistoryModal = document.getElementById('blockHistoryModal');
        this.importBlockModal = document.getElementById('importBlockModal');
        this.shortcutsModal = document.getElementById('shortcutsModal');

        // Keyboard Shortcuts
        this.keyboardShortcutsBtn = document.querySelector('.keyboard-shortcuts .btn');

        // Reorder Controls
        this.moveBlockUpBtn = document.getElementById('moveBlockUpBtn');
        this.moveBlockDownBtn = document.getElementById('moveBlockDownBtn');

        // Export Buttons
        this.exportEQuest2Btn = document.getElementById('exportEQuest2Btn');
        this.exportEQuest3Btn = document.getElementById('exportEQuest3Btn');

        // Verificar elementos críticos
        this.validateCriticalElements();
    }

    validateCriticalElements() {
        const criticalElements = {
            'Título do Questionário': this.titleInput,
            'Descrição do Questionário': this.descriptionInput,
            'Versão do Questionário': this.versionInput,
            'Árvore de Blocos': this.blocksTree,
            'Editor de Bloco': this.blockEditor,
            'Lista de Perguntas': this.questionsList
        };

        for (const [name, element] of Object.entries(criticalElements)) {
            if (!element) {
                console.error(`Elemento crítico não encontrado: ${name}`);
            }
        }
    }

    attachEventListeners() {
        // Metadata
        if (this.titleInput) {
            this.titleInput.addEventListener('change', () => this.updateMetadata());
        }
        if (this.descriptionInput) {
            this.descriptionInput.addEventListener('change', () => this.updateMetadata());
        }
        if (this.versionInput) {
            this.versionInput.addEventListener('change', () => this.updateMetadata());
        }

        // Blocks
        if (this.addBlockBtn) {
            this.addBlockBtn.addEventListener('click', () => this.addBlock());
        }
        if (this.importBlockBtn) {
            this.importBlockBtn.addEventListener('click', () => this.showImportModal());
        }
        if (this.blocksTree) {
            this.blocksTree.addEventListener('click', (e) => this.handleBlockTreeClick(e));
        }

        // Block Editor
        if (this.blockTitleInput) {
            this.blockTitleInput.addEventListener('change', () => this.updateBlock());
        }
        if (this.colorButtons) {
            this.colorButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    const color = btn.dataset.color;
                    this.updateBlockColor(color);
                    this.colorButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                });
            });
        }
        if (this.duplicateBlockBtn) {
            this.duplicateBlockBtn.addEventListener('click', () => this.duplicateBlock());
        }
        if (this.exportBlockBtn) {
            this.exportBlockBtn.addEventListener('click', () => this.exportBlock());
        }
        if (this.blockHistoryBtn) {
            this.blockHistoryBtn.addEventListener('click', () => this.showBlockHistory());
        }
        if (this.saveBlockBtn) {
            this.saveBlockBtn.addEventListener('click', () => this.saveBlock());
        }
        if (this.deleteBlockBtn) {
            this.deleteBlockBtn.addEventListener('click', () => this.deleteBlock());
        }
        if (this.expandAllQuestionsBtn) {
            this.expandAllQuestionsBtn.addEventListener('click', () => this.expandAllQuestions());
        }
        if (this.collapseAllQuestionsBtn) {
            this.collapseAllQuestionsBtn.addEventListener('click', () => this.collapseAllQuestions());
        }

        // Questions
        if (this.addQuestionBtn) {
            this.addQuestionBtn.addEventListener('click', () => this.showQuestionForm());
        }

        // Modals
        document.querySelectorAll('.close-modal').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        // Inline Question Form
        if (this.questionFormElement) {
            this.questionFormElement.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveQuestion();
            });
        }

        if (this.cancelQuestionBtn) {
            this.cancelQuestionBtn.addEventListener('click', () => this.hideQuestionForm());
        }

        // Import Block
        const importFile = document.getElementById('importFile');
        if (importFile) {
            importFile.addEventListener('change', (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (file.type === 'application/json') {
                        this.selectedFiles.add(file);
                    }
                });
                this.updateSelectedFilesList();
            });
        }

        const confirmImport = document.getElementById('confirmImport');
        if (confirmImport) {
            confirmImport.addEventListener('click', () => this.importBlock());
        }

        const cancelImport = document.getElementById('cancelImport');
        if (cancelImport) {
            cancelImport.addEventListener('click', () => this.closeModals());
        }

        // Reorder Controls
        if (this.moveBlockUpBtn) {
            this.moveBlockUpBtn.addEventListener('click', () => this.moveBlockUp());
        }
        if (this.moveBlockDownBtn) {
            this.moveBlockDownBtn.addEventListener('click', () => this.moveBlockDown());
        }

        // Export Buttons
        if (this.exportEQuest2Btn) {
            this.exportEQuest2Btn.addEventListener('click', () => {
                console.log('Exportando para eQuest2...');
                this.exportToEQuest2();
            });
        }
        if (this.exportEQuest3Btn) {
            this.exportEQuest3Btn.addEventListener('click', () => {
                console.log('Exportando para eQuest3...');
                this.exportToEQuest3();
            });
        }

        // Keyboard Shortcuts
        if (this.keyboardShortcutsBtn) {
            this.keyboardShortcutsBtn.addEventListener('click', () => {
                this.shortcutsModal.classList.remove('hidden');
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 'n':
                        e.preventDefault();
                        this.addBlock();
                        break;
                    case 's':
                        e.preventDefault();
                        this.saveBlock();
                        break;
                    case 'd':
                        e.preventDefault();
                        this.duplicateBlock();
                        break;
                    case 'z':
                        e.preventDefault();
                        if (e.shiftKey) {
                            this.redo();
                        } else {
                            this.undo();
                        }
                        break;
                }
            }
        });
    }

    render() {
        this.renderMetadata();
        this.renderBlocksTree();
        this.renderBlockEditor();
        this.updateStatistics();
        this.updateReorderButtons();
    }

    renderMetadata() {
        const questionnaire = this.questionnaireManager.questionnaire;
        this.titleInput.value = questionnaire.title;
        this.descriptionInput.value = questionnaire.description;
        this.versionInput.value = questionnaire.version;
    }

    renderBlocksTree() {
        this.blocksTree.innerHTML = '';
        this.questionnaireManager.questionnaire.blocks.forEach(block => {
            const blockElement = this.createBlockElement(block);
            this.blocksTree.appendChild(blockElement);
        });
    }

    createBlockElement(block) {
        const div = document.createElement('div');
        div.className = `block-item ${block.id === this.currentBlockId ? 'active' : ''}`;
        div.draggable = true;
        div.dataset.blockId = block.id;
        div.style.backgroundColor = this.getLightColor(block.color);

        // Adiciona os event listeners de drag and drop
        div.addEventListener('dragstart', (e) => this.handleDragStart(e));
        div.addEventListener('dragend', (e) => this.handleDragEnd(e));
        div.addEventListener('dragover', (e) => this.handleDragOver(e));
        div.addEventListener('drop', (e) => this.handleDrop(e));
        div.addEventListener('dragleave', (e) => this.handleDragLeave(e));

        div.innerHTML = `
            <i class="fas fa-grip-vertical"></i>
            <div class="block-title">
                <span>${block.title}</span>
                <span class="question-count">${block.questions.length} perguntas</span>
            </div>
            <div class="block-actions">
                <button class="edit-block-btn" title="Editar bloco">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-block-btn" title="Excluir bloco">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        return div;
    }

    createQuestionElement(question) {
        console.log(`[UI] Criando elemento para pergunta ID: ${question.id}, isExpanded: ${question.isExpanded}`);
        const div = document.createElement('div');
        div.className = `tree-item question-item ${question.id === this.currentQuestionId ? 'editing-question' : ''}`;
        div.dataset.questionId = question.id;
        div.draggable = true;

        // Adiciona os event listeners de drag and drop
        div.addEventListener('dragstart', (e) => this.handleQuestionDragStart(e));
        div.addEventListener('dragend', (e) => this.handleQuestionDragEnd(e));
        div.addEventListener('dragover', (e) => this.handleQuestionDragOver(e));
        div.addEventListener('drop', (e) => this.handleQuestionDrop(e));
        div.addEventListener('dragleave', (e) => this.handleQuestionDragLeave(e));

        const questionTypeMap = {
            'text': 'Texto',
            'number': 'Número',
            'date': 'Data',
            'select': 'Seleção',
            'multiselect': 'Múltipla Escolha',
            'radio': 'Escolha Única',
            'checkbox': 'Caixas de Seleção',
            'scale': 'Escala',
            'matrix': 'Matriz',
            'ranking': 'Ranking',
            'file': 'Arquivo',
            'image': 'Imagem',
            'signature': 'Assinatura',
            'location': 'Localização',
            'contact': 'Contato',
            'payment': 'Pagamento',
            'calculation': 'Cálculo',
            'hidden': 'Oculta',
            'section': 'Seção',
            'page': 'Página'
        };

        const header = document.createElement('div');
        header.className = 'question-item-header';
        header.innerHTML = `
            <div class="question-item-title">
                <i class="fas fa-grip-vertical"></i>
                <span class="question-id">${question.id}</span>
                <span class="question-title">${question.title}</span>
                <span class="question-type">${questionTypeMap[question.type] || question.type}</span>
            </div>
            <div class="question-item-actions">
                <button class="move-question-btn" title="Mover pergunta">
                    <i class="fas fa-arrows-alt-h"></i>
                </button>
                <button class="duplicate-question-btn" title="Duplicar pergunta">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="edit-question-btn" title="Editar pergunta">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-question-btn" title="Excluir pergunta">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="toggle-question-btn" title="Expandir/Recolher">
                    <i class="fas fa-chevron-${question.isExpanded ? 'up' : 'down'}"></i>
                </button>
            </div>
        `;

        // Adicionar eventos aos botões
        const editBtn = header.querySelector('.edit-question-btn');
        const deleteBtn = header.querySelector('.delete-question-btn');
        const toggleBtn = header.querySelector('.toggle-question-btn');
        const moveBtn = header.querySelector('.move-question-btn');
        const duplicateBtn = header.querySelector('.duplicate-question-btn');

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showQuestionForm(question);
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm('Tem certeza que deseja excluir esta pergunta?')) {
                if (this.currentBlockId) {
                    const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
                    if (block) {
                        block.removeQuestion(question.id);
                        this.render();
                    }
                }
            }
        });

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleQuestion(question, div);
        });

        moveBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showMoveQuestionMenu(e, question);
        });

        duplicateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.duplicateQuestion(question);
        });

        // Adicionar evento de clique no header para expandir/recolher
        header.addEventListener('click', (e) => {
            // Verifica se o clique não foi em nenhum dos botões de ação
            if (!e.target.closest('.question-item-actions')) {
                this.toggleQuestion(question, div);
            }
        });

        div.appendChild(header);

        const content = document.createElement('div');
        content.className = `question-item-content ${question.isExpanded ? '' : 'hidden'}`;
        content.innerHTML = `
            <div class="question-item-details">
                ${this.renderQuestionDetails(question)}
            </div>
        `;

        div.appendChild(content);
        return div;
    }

    duplicateQuestion(question) {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        // Cria uma cópia profunda da pergunta
        const duplicatedQuestion = JSON.parse(JSON.stringify(question));
        
        // Gera um novo ID para a pergunta duplicada
        duplicatedQuestion.id = `q_${Date.now()}`;
        
        // Adiciona "(cópia)" ao título
        duplicatedQuestion.title = `${duplicatedQuestion.title} (cópia)`;
        
        // Encontra o índice da pergunta original
        const originalIndex = block.questions.findIndex(q => q.id === question.id);
        
        // Insere a pergunta duplicada logo após a original
        block.questions.splice(originalIndex + 1, 0, duplicatedQuestion);
        
        // Atualiza a interface
        this.render();
    }

    showMoveQuestionMenu(event, question) {
        // Remove qualquer menu existente
        const existingMenu = document.querySelector('.move-question-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        // Cria o menu
        const menu = document.createElement('div');
        menu.className = 'move-question-menu';

        // Adiciona as opções de blocos
        this.questionnaireManager.questionnaire.blocks.forEach(block => {
            const option = document.createElement('div');
            option.className = `block-option ${block.id === this.currentBlockId ? 'current' : ''}`;
            option.innerHTML = `
                <i class="fas fa-cube"></i>
                <span>${block.title}</span>
            `;

            if (block.id !== this.currentBlockId) {
                option.addEventListener('click', () => {
                    this.moveQuestionToBlock(question, block.id);
                    menu.remove();
                });
            }

            menu.appendChild(option);
        });

        // Posiciona o menu
        const button = event.target.closest('.move-question-btn');
        const rect = button.getBoundingClientRect();
        menu.style.top = `${rect.bottom + window.scrollY + 5}px`;
        menu.style.left = `${rect.left + window.scrollX}px`;

        // Adiciona o menu ao documento
        document.body.appendChild(menu);

        // Fecha o menu ao clicar fora
        const closeMenu = (e) => {
            if (!menu.contains(e.target) && !button.contains(e.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };

        // Adiciona o evento com um pequeno delay para não fechar imediatamente
        setTimeout(() => {
            document.addEventListener('click', closeMenu);
        }, 100);
    }

    moveQuestionToBlock(question, targetBlockId) {
        if (!this.currentBlockId) return;

        const sourceBlock = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        const targetBlock = this.questionnaireManager.questionnaire.getBlock(targetBlockId);

        if (!sourceBlock || !targetBlock) return;

        // Remove a pergunta do bloco atual
        const questionIndex = sourceBlock.questions.findIndex(q => q.id === question.id);
        if (questionIndex === -1) return;

        const [movedQuestion] = sourceBlock.questions.splice(questionIndex, 1);

        // Adiciona a pergunta ao final do bloco de destino
        targetBlock.questions.push(movedQuestion);

        // Atualiza a interface
        this.render();
    }

    handleQuestionDragStart(e) {
        const questionItem = e.target.closest('.question-item');
        if (!questionItem) return;

        e.dataTransfer.setData('text/plain', questionItem.dataset.questionId);
        questionItem.classList.add('dragging');
    }

    handleQuestionDragOver(e) {
        e.preventDefault();
        const questionItem = e.target.closest('.question-item');
        if (!questionItem) return;

        const draggingItem = document.querySelector('.question-item.dragging');
        if (!draggingItem) return;

        const rect = questionItem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY < midY) {
            questionItem.style.borderTop = '2px solid #0d6efd';
            questionItem.style.borderBottom = '';
        } else {
            questionItem.style.borderBottom = '2px solid #0d6efd';
            questionItem.style.borderTop = '';
        }
    }

    handleQuestionDragLeave(e) {
        const questionItem = e.target.closest('.question-item');
        if (!questionItem) return;

        questionItem.style.borderTop = '';
        questionItem.style.borderBottom = '';
    }

    handleQuestionDragEnd(e) {
        const questionItem = e.target.closest('.question-item');
        if (!questionItem) return;

        questionItem.classList.remove('dragging');
        document.querySelectorAll('.question-item').forEach(item => {
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
    }

    handleQuestionDrop(e) {
        e.preventDefault();
        const questionItem = e.target.closest('.question-item');
        if (!questionItem) return;

        const sourceId = e.dataTransfer.getData('text/plain');
        const targetId = questionItem.dataset.questionId;

        if (sourceId === targetId) return;

        const rect = questionItem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const insertAfter = e.clientY > midY;

        if (this.currentBlockId) {
            const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
            if (!block) return;

            const sourceIndex = block.questions.findIndex(q => q.id === sourceId);
            const targetIndex = block.questions.findIndex(q => q.id === targetId);
            
            if (sourceIndex === -1 || targetIndex === -1) return;

            const question = block.questions[sourceIndex];
            block.questions.splice(sourceIndex, 1);
            
            const newIndex = insertAfter ? targetIndex + 1 : targetIndex;
            block.questions.splice(newIndex, 0, question);

            this.render();
        }
    }

    // Novo método para lidar com a expansão/recolhimento da pergunta
    toggleQuestion(question, element) {
        question.isExpanded = !question.isExpanded;
        const content = element.querySelector('.question-item-content');
        if (content) {
            content.classList.toggle('hidden', !question.isExpanded);
        }
        const icon = element.querySelector('.toggle-question-btn i');
        if (icon) {
            icon.className = `fas fa-chevron-${question.isExpanded ? 'up' : 'down'}`;
        }
    }

    renderBlockEditor() {
        if (!this.currentBlockId) {
            this.blockEditor.classList.add('hidden');
            return;
        }

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        this.blockEditor.classList.remove('hidden');
        this.blockTitleInput.value = block.title;
        
        // Atualizar botões de cor
        this.colorButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.color === block.color) {
                btn.classList.add('active');
            }
        });

        this.blockEditor.style.backgroundColor = this.getLightColor(block.color);

        // Render questions
        this.renderQuestions();
    }

    renderQuestions() {
        if (!this.currentBlockId) {
            this.questionsList.innerHTML = '<div class="no-questions">Selecione um bloco para ver suas perguntas</div>';
            return;
        }

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) {
            this.questionsList.innerHTML = '<div class="no-questions">Bloco não encontrado</div>';
            return;
        }

        if (block.questions.length === 0) {
            this.questionsList.innerHTML = '<div class="no-questions">Este bloco não possui perguntas</div>';
            return;
        }

        this.questionsList.innerHTML = '';
        block.questions.forEach(question => {
            const questionElement = this.createQuestionElement(question);
            this.questionsList.appendChild(questionElement);
        });
    }

    updateStatistics() {
        const stats = this.questionnaireManager.questionnaire.getStatistics();
        this.blocksStats.totalBlocks.textContent = stats.totalBlocks;
        this.blocksStats.totalQuestions.textContent = stats.totalQuestions;
    }

    // Event Handlers
    handleBlockTreeClick(e) {
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        // Não processa o clique se for em um botão de ação
        if (e.target.closest('.block-actions')) return;

        const blockId = blockItem.dataset.blockId;
        if (!blockId) return;

        // Seleciona o bloco
        this.selectBlock(blockId);

        // Atualiza a UI para mostrar o bloco selecionado
        document.querySelectorAll('.block-item').forEach(item => {
            item.classList.remove('active');
        });
        blockItem.classList.add('active');

        // Mostra o editor do bloco
        this.blockEditor.classList.remove('hidden');
        
        // Renderiza as perguntas do bloco
        this.renderQuestions();

        // Esconde o formulário de pergunta se estiver visível
        this.hideQuestionForm();

        // Foca no início do bloco no editor
        this.blockEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    handleDragStart(e) {
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        e.dataTransfer.setData('text/plain', blockItem.dataset.blockId);
        blockItem.classList.add('dragging');
    }

    handleDragOver(e) {
        e.preventDefault();
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        const draggingItem = document.querySelector('.block-item.dragging');
        if (!draggingItem) return;

        const rect = blockItem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;

        if (e.clientY < midY) {
            blockItem.style.borderTop = '2px solid #0d6efd';
            blockItem.style.borderBottom = '';
        } else {
            blockItem.style.borderBottom = '2px solid #0d6efd';
            blockItem.style.borderTop = '';
        }
    }

    handleDragLeave(e) {
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        blockItem.style.borderTop = '';
        blockItem.style.borderBottom = '';
    }

    handleDragEnd(e) {
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        blockItem.classList.remove('dragging');
        document.querySelectorAll('.block-item').forEach(item => {
            item.style.borderTop = '';
            item.style.borderBottom = '';
        });
    }

    handleDrop(e) {
        e.preventDefault();
        const blockItem = e.target.closest('.block-item');
        if (!blockItem) return;

        const sourceId = e.dataTransfer.getData('text/plain');
        const targetId = blockItem.dataset.blockId;

        if (sourceId === targetId) return;

        const rect = blockItem.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        const insertAfter = e.clientY > midY;

        // Reordenar os blocos no questionário
        const sourceIndex = this.questionnaireManager.questionnaire.blocks.findIndex(b => b.id === sourceId);
        const targetIndex = this.questionnaireManager.questionnaire.blocks.findIndex(b => b.id === targetId);
        
        if (sourceIndex === -1 || targetIndex === -1) return;

        const block = this.questionnaireManager.questionnaire.blocks[sourceIndex];
        this.questionnaireManager.questionnaire.blocks.splice(sourceIndex, 1);
        
        const newIndex = insertAfter ? targetIndex + 1 : targetIndex;
        this.questionnaireManager.questionnaire.blocks.splice(newIndex, 0, block);

        // Atualizar a UI
        this.render();
    }

    // Actions
    addBlock() {
        const block = this.questionnaireManager.questionnaire.addBlock();
        this.currentBlockId = block.id;
        this.render();
    }

    updateBlock() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const newTitle = this.blockTitleInput.value.trim();
        if (!newTitle) {
            alert('O título do bloco não pode estar vazio');
            this.blockTitleInput.value = block.title;
            return;
        }

        block.title = newTitle;
        block.saveVersion('Atualização do bloco');
        this.render();
    }

    updateBlockColor(color) {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        block.color = color;
        block.saveVersion('Atualização da cor do bloco');
        this.render();
    }

    duplicateBlock() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const maintainDependencies = confirm('Deseja manter as dependências ao duplicar o bloco?');
        const newBlock = block.duplicate(maintainDependencies);
        this.questionnaireManager.questionnaire.addBlock(newBlock);
        this.currentBlockId = newBlock.id;
        this.render();
    }

    exportBlock() {
        if (!this.currentBlockId) return;

        const json = this.questionnaireManager.questionnaire.exportBlock(this.currentBlockId);
        if (!json) return;

        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `block-${this.currentBlockId}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    showBlockHistory() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const historyList = this.blockHistoryModal.querySelector('.history-list');
        historyList.innerHTML = '';

        block.versions.forEach((version, index) => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-item-header">
                    <span class="history-item-date">
                        ${new Date(version.timestamp).toLocaleString()}
                    </span>
                    <button class="btn btn-secondary revert-version" data-index="${index}">
                        Reverter
                    </button>
                </div>
                <div class="history-item-content">
                    ${version.comment}
                </div>
            `;
            historyList.appendChild(item);
        });

        this.blockHistoryModal.classList.remove('hidden');
    }

    showImportModal() {
        this.importBlockModal.classList.remove('hidden');
        this.selectedFiles = new Set();
        this.updateSelectedFilesList();
    }

    updateSelectedFilesList() {
        const filesList = document.getElementById('selectedFilesList');
        filesList.innerHTML = '';

        this.selectedFiles.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-item-info">
                    <i class="fas fa-file-json"></i>
                    <span class="file-item-name">${file.name}</span>
                    <span class="file-item-size">${this.formatFileSize(file.size)}</span>
                </div>
                <button type="button" class="file-item-remove" data-name="${file.name}">
                    <i class="fas fa-times"></i>
                </button>
            `;

            fileItem.querySelector('.file-item-remove').addEventListener('click', () => {
                this.selectedFiles.delete(file);
                this.updateSelectedFilesList();
            });

            filesList.appendChild(fileItem);
        });
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    importBlock() {
        const maintainDependencies = document.getElementById('maintainDependencies').checked;

        if (this.selectedFiles.size === 0) {
            alert('Por favor, selecione pelo menos um arquivo para importar.');
            return;
        }

        let successCount = 0;
        let errorCount = 0;

        this.selectedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const success = this.questionnaireManager.questionnaire.importBlock(e.target.result);
                if (success) {
                    successCount++;
                } else {
                    errorCount++;
                }

                // Verifica se todos os arquivos foram processados
                if (successCount + errorCount === this.selectedFiles.size) {
                    this.showImportResults(successCount, errorCount);
                }
            };
            reader.readAsText(file);
        });
    }

    showImportResults(successCount, errorCount) {
        let message = '';
        if (successCount > 0) {
            message += `${successCount} bloco(s) importado(s) com sucesso.`;
        }
        if (errorCount > 0) {
            message += `\n${errorCount} bloco(s) falharam ao importar.`;
        }
        alert(message);
        this.closeModals();
        this.render();
    }

    closeModals() {
        this.blockHistoryModal.classList.add('hidden');
        this.importBlockModal.classList.add('hidden');
        this.shortcutsModal.classList.add('hidden');
    }

    updateMetadata() {
        const questionnaire = this.questionnaireManager.questionnaire;
        questionnaire.title = this.titleInput.value;
        questionnaire.description = this.descriptionInput.value;
        questionnaire.version = this.versionInput.value;
    }

    undo() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block || !block.versions.length) return;

        const lastVersion = block.versions[block.versions.length - 1];
        block.revertToVersion(block.versions.length - 1);
        this.render();
    }

    redo() {
        // Implementar redo se necessário
    }

    showQuestionForm(question = null) {
        // Sempre garante que o formulário está visível
        this.questionForm.classList.remove('hidden-inline');

        // Remover o formulário de sua posição atual, se estiver no DOM
        if (this.questionForm.parentNode) {
            this.questionForm.parentNode.removeChild(this.questionForm);
        }

        // Inserir o formulário na posição correta
        if (question) {
            const questionElement = document.querySelector(`[data-question-id="${question.id}"]`);
            if (questionElement && questionElement.parentNode) {
                questionElement.parentNode.insertBefore(this.questionForm, questionElement.nextSibling);
                this.currentQuestionId = question.id; // Garante que currentQuestionId esteja sempre atualizado para o destaque
                // Garante que a pergunta está expandida ao abrir o formulário
                if (question.isExpanded === false) {
                    question.isExpanded = true;
                    const content = questionElement.querySelector('.question-item-content');
                    if (content) content.classList.remove('hidden');
                    const icon = questionElement.querySelector('.toggle-question-btn i');
                    if (icon) icon.className = 'fas fa-chevron-up';
                }
                questionElement.classList.add('editing-question'); // Adiciona a classe de destaque diretamente

            } else {
                // Fallback: se o elemento da pergunta não for encontrado, adiciona ao final da lista de perguntas
                this.questionsList.appendChild(this.questionForm);
                this.currentQuestionId = null; 
            }
        } else {
            // Se for uma nova pergunta, adiciona ao final da lista de perguntas
            this.questionsList.appendChild(this.questionForm);
            this.currentQuestionId = null;
        }

        // Agora que o formulário está no DOM, podemos resetá-lo e preenchê-lo
        this.questionFormElement.reset(); // Usar a referência da classe

        // Scroll para o formulário após posicioná-lo
        this.questionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Configurar campos baseados no tipo de pergunta
        const typeSelect = document.getElementById('questionType');
        typeSelect.addEventListener('change', () => this.updateQuestionFields(typeSelect.value));

        if (question) {
            // Preencher o formulário com os dados da pergunta existente
            typeSelect.value = question.type;
            document.getElementById('questionId').value = question.id;
            document.getElementById('questionTitle').value = question.title;
            document.getElementById('questionBehavior').value = question.behavior || '';
            document.getElementById('questionMedia').value = question.media || '';
            document.getElementById('opOther').value = question.OpOther || '';
            document.getElementById('questionSize').value = question.size || '';
            document.getElementById('questionReference').value = question.reference || '';
            document.getElementById('questionReplication').value = question.replication || '';
            document.getElementById('allowOnlyNumbers').checked = question.allowOnlyNumbers || false;
            document.getElementById('showDontKnow').checked = question.showDontKnow || false;
            document.getElementById('showDontAnswer').checked = question.showDontAnswer || false;
            document.getElementById('showDontApply').checked = question.showDontApply || false;

            // Limpar e reconstruir opções
            const optionsContainer = document.getElementById('optionsContainer');
            optionsContainer.innerHTML = '';
            Object.entries(question.Options || {}).forEach(([key, value]) => {
                this.addOptionField(value);
            });

            // Limpar e reconstruir dependências
            const dependenciesContainer = document.getElementById('dependenciesContainer');
            dependenciesContainer.innerHTML = '';
            (question.dependencies || []).forEach(dep => {
                this.addDependencyField(dep);
            });

            // Atualizar campos visíveis
            this.updateQuestionFields(question.type);
        } else {
            // Limpar o formulário e mostrar campos padrão
            this.updateQuestionFields(typeSelect.value);
        }
    }

    hideQuestionForm() {
        this.questionForm.classList.add('hidden-inline');
        
        // Voltar o foco para a pergunta que estava sendo editada, se houver
        if (this.currentQuestionId) {
            // Encontrar o elemento da pergunta recém-renderizado (se houver, pois render() pode ter sido chamado)
            const questionElement = document.querySelector(`[data-question-id="${this.currentQuestionId}"]`);
            if (questionElement) {
                questionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                questionElement.focus(); // Opcional: tenta focar no elemento
            }
        }
        this.currentQuestionId = null; // Limpa o ID da pergunta atual APÓS a operação
        this.render(); // Adicionado: Re-renderiza a UI para garantir que o destaque seja removido se o currentQuestionId foi nullified
    }

    updateQuestionFields(type) {
        // Esconder todos os campos específicos
        document.querySelectorAll('.media-fields, .options-fields, .size-fields, .reference-fields, .replication-fields, .number-fields, .dont-show-fields').forEach(el => {
            el.classList.add('hidden');
        });

        // Mostrar campos baseados no tipo
        switch (type) {
            case 'NotAnswerableQuestion':
                // Campos básicos + behavior + replication + dependencies
                document.querySelector('.replication-fields').classList.remove('hidden');
                break;

            case 'EditQuestion':
                // Campos básicos + behavior + replication + reference + size + allowOnlyNumbers + dont-show + dependencies
                document.querySelector('.size-fields').classList.remove('hidden');
                document.querySelector('.reference-fields').classList.remove('hidden');
                document.querySelector('.replication-fields').classList.remove('hidden');
                document.querySelector('.number-fields').classList.remove('hidden');
                document.querySelector('.dont-show-fields').classList.remove('hidden');
                break;

            case 'OnlyOneChoiceQuestion':
            case 'MultipleChoiceQuestion':
                // Campos básicos + behavior + Options + OpOther + replication + dont-show + dependencies
                document.querySelector('.options-fields').classList.remove('hidden');
                document.querySelector('.replication-fields').classList.remove('hidden');
                document.querySelector('.dont-show-fields').classList.remove('hidden');
                break;

            case 'GeoLocationQuestion':
                // Campos básicos + behavior + replication + dont-show + dependencies
                document.querySelector('.replication-fields').classList.remove('hidden');
                document.querySelector('.dont-show-fields').classList.remove('hidden');
                break;

            case 'PearsonCreatorQuestion':
            case 'ReplicableItemQuestion':
                // Campos básicos + behavior + size + allowOnlyNumbers + dont-show + dependencies
                document.querySelector('.size-fields').classList.remove('hidden');
                document.querySelector('.number-fields').classList.remove('hidden');
                document.querySelector('.dont-show-fields').classList.remove('hidden');
                break;

            case 'ReplicationQuestion':
                // Campos básicos + behavior + size + allowOnlyNumbers (obrigatório) + dont-show + dependencies
                document.querySelector('.size-fields').classList.remove('hidden');
                document.querySelector('.number-fields').classList.remove('hidden');
                document.querySelector('.dont-show-fields').classList.remove('hidden');
                document.getElementById('allowOnlyNumbers').checked = true;
                document.getElementById('allowOnlyNumbers').disabled = true;
                break;

            case 'MediaQuestion':
                // Campos básicos + behavior + media + replication + dependencies
                document.querySelector('.media-fields').classList.remove('hidden');
                document.querySelector('.replication-fields').classList.remove('hidden');
                break;
        }
    }

    saveQuestion() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const type = document.getElementById('questionType').value;
        const questionData = {
            type: type,
            id: document.getElementById('questionId').value,
            title: document.getElementById('questionTitle').value
        };

        // Adicionar campos baseados no tipo
        switch (type) {
            case 'text':
                questionData.behavior = document.getElementById('textBehavior').value;
                break;
            case 'number':
                questionData.allowOnlyNumbers = document.getElementById('allowOnlyNumbers').checked;
                break;
            case 'select':
            case 'multiselect':
            case 'radio':
            case 'checkbox':
                const options = {};
                const optionsList = document.getElementById('optionsList');
                optionsList.querySelectorAll('.option-item').forEach(item => {
                    const key = item.querySelector('.option-key').value;
                    const value = item.querySelector('.option-value').value;
                    if (key && value) {
                        options[key] = value;
                    }
                });
                questionData.Options = options;
                questionData.OpOther = document.getElementById('opOther').checked;
                break;
            case 'media':
                questionData.media = document.getElementById('mediaUrl').value;
                break;
            case 'replication':
                questionData.replication = document.getElementById('replicationCount').value;
                break;
        }

        if (this.currentQuestionId) {
            // Update existing question
            const questionIndex = block.questions.findIndex(q => q.id === this.currentQuestionId);
            if (questionIndex !== -1) {
                // Preservar o estado isExpanded da pergunta original
                const originalQuestion = block.questions[questionIndex];
                questionData.isExpanded = originalQuestion.isExpanded;
                block.questions[questionIndex] = new Question(questionData);
            }
        } else {
            // Add new question (isExpanded defaults to false in Question constructor)
            block.addQuestion(new Question(questionData));
        }

        block.saveVersion('Atualização de pergunta');
        this.render(); // Renderiza ANTES de esconder o formulário para manter o estado
        this.hideQuestionForm(); // Esconde o formulário e remove o destaque
    }

    getLightColor(color) {
        // Converte a cor para RGB
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        // Aplica uma transparência de 10%
        return `rgba(${r}, ${g}, ${b}, 0.1)`;
    }

    updateReorderButtons() {
        if (!this.currentBlockId) {
            this.moveBlockUpBtn.disabled = true;
            this.moveBlockDownBtn.disabled = true;
            return;
        }

        const blocks = this.questionnaireManager.questionnaire.blocks;
        const currentIndex = blocks.findIndex(b => b.id === this.currentBlockId);

        this.moveBlockUpBtn.disabled = currentIndex <= 0;
        this.moveBlockDownBtn.disabled = currentIndex >= blocks.length - 1;
    }

    moveBlockUp() {
        if (!this.currentBlockId) return;

        const blocks = this.questionnaireManager.questionnaire.blocks;
        const currentIndex = blocks.findIndex(b => b.id === this.currentBlockId);
        
        if (currentIndex > 0) {
            this.questionnaireManager.questionnaire.moveBlock(currentIndex, currentIndex - 1);
            this.render();
        }
    }

    moveBlockDown() {
        if (!this.currentBlockId) return;

        const blocks = this.questionnaireManager.questionnaire.blocks;
        const currentIndex = blocks.findIndex(b => b.id === this.currentBlockId);
        
        if (currentIndex < blocks.length - 1) {
            this.questionnaireManager.questionnaire.moveBlock(currentIndex, currentIndex + 1);
            this.render();
        }
    }

    exportToEQuest2() {
        console.log('Iniciando exportação eQuest2...');
        try {
            if (!this.questionnaireManager || !this.questionnaireManager.questionnaire) {
                throw new Error('Questionário não encontrado');
            }

            const questionnaire = this.questionnaireManager.questionnaire;
            console.log('Questionário encontrado:', questionnaire);

            if (!questionnaire.title || !questionnaire.version) {
                alert('Por favor, preencha o título e a versão do questionário antes de exportar.');
                return;
            }

            if (!questionnaire.blocks || questionnaire.blocks.length === 0) {
                alert('O questionário não possui blocos para exportar.');
                return;
            }

            const eQuest2Data = questionnaire.blocks.map(block => {
                const blockData = {};
                blockData[block.title] = block.questions.map(question => {
                    const questionData = {
                        type: question.type,
                        id: question.id,
                        title: question.title
                    };

                    // Adicionar campos apenas se tiverem valor
                    if (question.behavior) questionData.behavior = question.behavior;
                    if (question.OpOther) questionData.OpOther = question.OpOther;
                    if (question.allowOnlyNumbers) questionData.allowOnlyNumbers = true;
                    if (question.size) questionData.size = question.size;
                    if (question.replication) questionData.replication = question.replication;
                    if (question.reference) questionData.reference = question.reference;
                    if (question.showDontKnow) questionData.showDontKnow = true;
                    if (question.showDontAnswer) questionData.showDontAnswer = true;
                    if (question.showDontApply) questionData.showDontApply = true;

                    // Adicionar opções numeradas para OnlyOneChoiceQuestion e MultipleChoiceQuestion
                    if (question.type === 'OnlyOneChoiceQuestion' || question.type === 'MultipleChoiceQuestion') {
                        Object.entries(question.Options || {}).forEach(([key, value]) => {
                            if (value) {
                                questionData[`Op${key}`] = value;
                            }
                        });
                    }

                    // Adicionar dependências apenas se existirem
                    if (question.dependencies && question.dependencies.length > 0) {
                        questionData.dependencies = question.dependencies
                            .filter(dep => dep.dependencyID && dep.dependencyValue)
                            .map(dep => ({
                                dependencyID: dep.dependencyID,
                                dependencyValue: dep.dependencyValue
                            }));
                    }

                    return questionData;
                });
                return blockData;
            });

            console.log('Dados preparados para exportação:', eQuest2Data);
            const json = JSON.stringify(eQuest2Data, null, 2);
            this.downloadFile(json, `questionnaire-equest2-${questionnaire.version}.json`);
        } catch (error) {
            console.error('Erro ao exportar para eQuest2:', error);
            alert('Erro ao exportar para eQuest2. Por favor, tente novamente.');
        }
    }

    exportToEQuest3() {
        console.log('Iniciando exportação eQuest3...');
        try {
            if (!this.questionnaireManager || !this.questionnaireManager.questionnaire) {
                throw new Error('Questionário não encontrado');
            }

            const questionnaire = this.questionnaireManager.questionnaire;
            console.log('Questionário encontrado:', questionnaire);

            if (!questionnaire.title || !questionnaire.version) {
                alert('Por favor, preencha o título e a versão do questionário antes de exportar.');
                return;
            }

            if (!questionnaire.blocks || questionnaire.blocks.length === 0) {
                alert('O questionário não possui blocos para exportar.');
                return;
            }

            const eQuest3Data = {
                title: questionnaire.title,
                description: questionnaire.description || '',
                questionnaireVersion: questionnaire.version,
                blocks: questionnaire.blocks.map(block => {
                    const blockData = {
                        title: block.title,
                        questions: block.questions.map(question => {
                            const questionData = {
                                type: question.type,
                                id: question.id,
                                title: question.title
                            };

                            // Adicionar campos apenas se tiverem valor
                            if (question.behavior) questionData.behavior = question.behavior;
                            if (question.media) questionData.media = question.media;
                            if (question.OpOther) questionData.OpOther = question.OpOther;
                            if (question.replication) questionData.replication = question.replication;
                            if (question.reference) questionData.reference = question.reference;
                            if (question.size) questionData.size = question.size;
                            if (question.allowOnlyNumbers) questionData.allowOnlyNumbers = true;
                            if (question.showDontKnow) questionData.showDontKnow = true;
                            if (question.showDontAnswer) questionData.showDontAnswer = true;
                            if (question.showDontApply) questionData.showDontAply = true;

                            // Adicionar opções apenas se existirem
                            if (question.Options && Object.keys(question.Options).length > 0) {
                                questionData.Options = Object.entries(question.Options)
                                    .filter(([_, value]) => value)
                                    .reduce((acc, [key, value]) => {
                                        acc[key] = value;
                                        return acc;
                                    }, {});
                            }

                            // Adicionar dependências apenas se existirem
                            if (question.dependencies && question.dependencies.length > 0) {
                                questionData.dependencies = question.dependencies
                                    .filter(dep => dep.dependencyID && dep.dependencyValue)
                                    .map(dep => {
                                        const dependency = {
                                            dependencyID: dep.dependencyID,
                                            dependencyValue: dep.dependencyValue
                                        };
                                        if (dep.operator) dependency.operator = dep.operator;
                                        return dependency;
                                    });
                            }

                            return questionData;
                        })
                    };

                    return blockData;
                })
            };

            console.log('Dados preparados para exportação:', eQuest3Data);
            const json = JSON.stringify(eQuest3Data, null, 2);
            this.downloadFile(json, `questionnaire-equest3-${questionnaire.version}.json`);
        } catch (error) {
            console.error('Erro ao exportar para eQuest3:', error);
            alert('Erro ao exportar para eQuest3. Por favor, tente novamente.');
        }
    }

    downloadFile(content, filename) {
        console.log('Iniciando download do arquivo:', filename);
        try {
            const blob = new Blob([content], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('Download concluído com sucesso');
        } catch (error) {
            console.error('Erro ao baixar arquivo:', error);
            alert('Erro ao gerar o arquivo de exportação. Por favor, tente novamente.');
        }
    }

    addOptionField(value = '') {
        const optionElement = document.createElement('div');
        optionElement.className = 'option-item';
        optionElement.innerHTML = `
            <input type="text" value="${value}" placeholder="Opção de resposta">
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        optionElement.querySelector('.remove-btn').addEventListener('click', () => {
            optionElement.remove();
        });

        document.getElementById('optionsContainer').appendChild(optionElement);
    }

    addDependencyField(dependency = null) {
        const dependencyElement = document.createElement('div');
        dependencyElement.className = 'dependency-item';
        dependencyElement.innerHTML = `
            <input type="text" name="dependencyId" value="${dependency?.dependencyID || ''}" placeholder="ID da dependência">
            <input type="text" name="dependencyValue" value="${dependency?.dependencyValue || ''}" placeholder="Valor da dependência">
            <select name="operator">
                <option value="equals" ${dependency?.operator === 'equals' ? 'selected' : ''}>Igual a</option>
                <option value="notEquals" ${dependency?.operator === 'notEquals' ? 'selected' : ''}>Diferente de</option>
                <option value="greaterThan" ${dependency?.operator === 'greaterThan' ? 'selected' : ''}>Maior que</option>
                <option value="lessThan" ${dependency?.operator === 'lessThan' ? 'selected' : ''}>Menor que</option>
            </select>
            <button type="button" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;

        dependencyElement.querySelector('.remove-btn').addEventListener('click', () => {
            dependencyElement.remove();
        });

        document.getElementById('dependenciesContainer').appendChild(dependencyElement);
    }

    initializeQuestionnaireImport() {
        const fileInput = document.getElementById('importQuestionnaireFile');
        const importBtn = document.getElementById('importBtn');
        const formatRadios = document.querySelectorAll('input[name="importFormat"]');
        const toggleImportBtn = document.getElementById('toggleImportBtn');
        const importOptions = document.querySelector('.import-options');

        if (!fileInput || !importBtn || !toggleImportBtn || !importOptions) {
            console.error('Elementos de importação não encontrados');
            return;
        }

        // Toggle da seção de importação
        toggleImportBtn.addEventListener('click', () => {
            importOptions.classList.toggle('hidden');
            if (!importOptions.classList.contains('hidden')) {
                // Resetar o estado quando mostrar
                fileInput.value = '';
                this.updateImportButton();
            }
        });

        // Event listener para mudança no input de arquivo
        fileInput.addEventListener('change', () => {
            this.updateImportButton();
        });

        // Event listeners para os radio buttons de formato
        formatRadios.forEach(radio => {
            radio.addEventListener('change', () => this.updateImportButton());
        });

        // Event listener para o botão de importar
        importBtn.addEventListener('click', () => this.importQuestionnaire());
    }

    updateImportButton() {
        const fileInput = document.getElementById('importQuestionnaireFile');
        const importBtn = document.getElementById('importBtn');
        const formatSelect = document.querySelector('input[name="importFormat"]:checked');
        
        if (fileInput && importBtn) {
            importBtn.disabled = !fileInput.files[0] || !formatSelect;
        }
    }

    async importQuestionnaire() {
        let logs = [];
        const log = (message) => {
            console.log(message);
            logs.push(message);
        };

        log('=== INÍCIO DA IMPORTAÇÃO ===');

        const fileInput = document.getElementById('importQuestionnaireFile');
        const formatSelect = document.querySelector('input[name="importFormat"]:checked');
        
        if (!fileInput || !formatSelect) {
            log('❌ Erro: elementos de importação não encontrados');
            this.showError('Elementos de importação não encontrados');
            return;
        }

        const file = fileInput.files[0];
        const format = formatSelect.value;

        if (!file) {
            log('❌ Erro: nenhum arquivo selecionado');
            this.showError('Por favor, selecione um arquivo para importar');
            return;
        }

        if (!file.name.endsWith('.json')) {
            log('❌ Erro: arquivo não é JSON');
            this.showError('Por favor, selecione um arquivo JSON');
            return;
        }

        if (!format) {
            log('❌ Erro: formato não selecionado');
            this.showError('Por favor, selecione um formato');
            return;
        }

        try {
            log('Lendo arquivo...');
            const text = await file.text();
            log('Arquivo lido com sucesso');

            log('Convertendo JSON...');
            const data = JSON.parse(text);
            log('JSON convertido com sucesso');

            log('Validando formato...');
            if (!this.validateQuestionnaireFormat(data, format)) {
                log('❌ Erro: validação falhou');
                return;
            }
            log('Formato validado com sucesso');

            if (!window.questionnaireManager) {
                log('❌ Erro: questionnaireManager não encontrado');
                this.showError('Erro ao acessar o gerenciador de questionário. Tente recarregar a página.');
                return;
            }

            // Verificar se existem blocos no questionário atual
            const currentBlocks = window.questionnaireManager.questionnaire.blocks;
            if (currentBlocks && currentBlocks.length > 0) {
                // Criar modal de confirmação
                const modal = document.createElement('div');
                modal.className = 'modal';
                modal.style.position = 'fixed';
                modal.style.top = '0';
                modal.style.left = '0';
                modal.style.width = '100%';
                modal.style.height = '100%';
                modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
                modal.style.display = 'flex';
                modal.style.justifyContent = 'center';
                modal.style.alignItems = 'center';
                modal.style.zIndex = '1000';

                const modalContent = document.createElement('div');
                modalContent.style.backgroundColor = 'white';
                modalContent.style.padding = '20px';
                modalContent.style.borderRadius = '8px';
                modalContent.style.maxWidth = '500px';
                modalContent.style.width = '100%';

                const title = document.createElement('h3');
                title.textContent = 'Questionário existente encontrado';
                title.style.marginBottom = '15px';

                const message = document.createElement('p');
                message.textContent = 'Existem blocos no questionário atual. Como você deseja proceder com a importação?';
                message.style.marginBottom = '20px';

                const buttonContainer = document.createElement('div');
                buttonContainer.style.display = 'flex';
                buttonContainer.style.gap = '10px';
                buttonContainer.style.justifyContent = 'flex-end';

                const appendButton = document.createElement('button');
                appendButton.textContent = 'Adicionar ao final';
                appendButton.style.padding = '8px 16px';
                appendButton.style.backgroundColor = '#0d6efd';
                appendButton.style.color = 'white';
                appendButton.style.border = 'none';
                appendButton.style.borderRadius = '4px';
                appendButton.style.cursor = 'pointer';

                const replaceButton = document.createElement('button');
                replaceButton.textContent = 'Substituir tudo';
                replaceButton.style.padding = '8px 16px';
                replaceButton.style.backgroundColor = '#dc3545';
                replaceButton.style.color = 'white';
                replaceButton.style.border = 'none';
                replaceButton.style.borderRadius = '4px';
                replaceButton.style.cursor = 'pointer';

                const cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancelar';
                cancelButton.style.padding = '8px 16px';
                cancelButton.style.backgroundColor = '#6c757d';
                cancelButton.style.color = 'white';
                cancelButton.style.border = 'none';
                cancelButton.style.borderRadius = '4px';
                cancelButton.style.cursor = 'pointer';

                buttonContainer.appendChild(appendButton);
                buttonContainer.appendChild(replaceButton);
                buttonContainer.appendChild(cancelButton);

                modalContent.appendChild(title);
                modalContent.appendChild(message);
                modalContent.appendChild(buttonContainer);
                modal.appendChild(modalContent);
                document.body.appendChild(modal);

                const removeModal = () => {
                    document.body.removeChild(modal);
                };

                appendButton.addEventListener('click', () => {
                    removeModal();
                    this.importBlocks(data, format, false);
                });

                replaceButton.addEventListener('click', () => {
                    removeModal();
                    this.importBlocks(data, format, true);
                });

                cancelButton.addEventListener('click', () => {
                    removeModal();
                });
            } else {
                // Se não houver blocos, importa normalmente
                this.importBlocks(data, format, false);
            }
        } catch (error) {
            log('❌ Erro durante a importação: ' + error.message);
            this.showError('Erro ao importar o arquivo: ' + error.message);
        }
    }

    importBlocks(data, format, replaceAll) {
        if (replaceAll) {
            // Limpar todos os blocos existentes
            window.questionnaireManager.questionnaire.blocks = [];
        }

        if (format.toLowerCase() === 'equest2') {
            // Para eQuest2, cada item do array é um bloco
            data.forEach((blockObj, index) => {
                // Obter o título do bloco (primeira chave do objeto)
                const blockTitle = Object.keys(blockObj)[0];
                const questions = blockObj[blockTitle];
                
                // Criar o bloco e obter seu índice
                const blockIndex = window.questionnaireManager.addBlock(blockTitle);
                
                // Obter o bloco usando o índice
                const block = window.questionnaireManager.questionnaire.blocks[blockIndex];
                if (!block) {
                    this.showError('Erro ao criar bloco: ' + blockTitle);
                    return;
                }
                
                // Garantir que o título do bloco está correto
                block.title = blockTitle;
                
                questions.forEach((q, qIndex) => {
                    // Criar objeto base da pergunta
                    const question = {
                        id: q.id,
                        title: q.title,
                        type: q.type
                    };

                    // Adicionar campos opcionais apenas se existirem
                    if (q.behavior) question.behavior = q.behavior;
                    if (q.media) question.media = q.media;
                    if (q.size) question.size = q.size;
                    if (q.reference) question.reference = q.reference;
                    if (q.replication) question.replication = q.replication;
                    if (q.OpOther) question.OpOther = q.OpOther;
                    
                    // Campos booleanos
                    if (q.allowOnlyNumbers) question.allowOnlyNumbers = true;
                    if (q.showDontKnow) question.showDontKnow = true;
                    if (q.showDontAnswer) question.showDontAnswer = true;
                    if (q.showDontApply) question.showDontApply = true;

                    // Mapear opções
                    const options = {};
                    Object.entries(q).forEach(([key, value]) => {
                        if (key.startsWith('Op') && key !== 'OpOther' && value) {
                            const optionNumber = key.replace('Op', '');
                            options[optionNumber] = value;
                        }
                    });
                    if (Object.keys(options).length > 0) {
                        question.Options = options;
                    }

                    // Dependências
                    if (q.dependencies && Array.isArray(q.dependencies)) {
                        question.dependencies = q.dependencies;
                    }
                    
                    // Adicionar a pergunta diretamente ao bloco
                    block.addQuestion(new Question(question));
                });
            });
        } else if (format.toLowerCase() === 'equest3') {
            // Para eQuest3, atualizar metadados do questionário
            window.questionnaireManager.questionnaire.title = data.title;
            window.questionnaireManager.questionnaire.description = data.description;
            window.questionnaireManager.questionnaire.questionnaireVersion = data.questionnaireVersion;

            // Importar blocos
            data.blocks.forEach(blockData => {
                // Criar o bloco e obter seu índice
                const blockIndex = window.questionnaireManager.addBlock(blockData.title);
                
                // Obter o bloco usando o índice
                const block = window.questionnaireManager.questionnaire.blocks[blockIndex];
                if (!block) {
                    this.showError('Erro ao criar bloco: ' + blockData.title);
                    return;
                }

                // Importar perguntas
                blockData.questions.forEach(q => {
                    // Criar objeto base da pergunta
                    const question = {
                        id: q.id,
                        title: q.title,
                        type: q.type
                    };

                    // Adicionar campos opcionais apenas se existirem
                    if (q.behavior) question.behavior = q.behavior;
                    if (q.media) question.media = q.media;
                    if (q.size) question.size = q.size;
                    if (q.reference) question.reference = q.reference;
                    if (q.replication) question.replication = q.replication;
                    if (q.OpOther) question.OpOther = q.OpOther;
                    
                    // Campos booleanos
                    if (q.allowOnlyNumbers) question.allowOnlyNumbers = true;
                    if (q.showDontKnow) question.showDontKnow = true;
                    if (q.showDontAnswer) question.showDontAnswer = true;
                    if (q.showDontApply) question.showDontApply = true;

                    // Opções
                    if (q.Options && Object.keys(q.Options).length > 0) {
                        question.Options = q.Options;
                    }

                    // Dependências
                    if (q.dependencies && Array.isArray(q.dependencies)) {
                        question.dependencies = q.dependencies;
                    }
                    
                    // Adicionar a pergunta diretamente ao bloco
                    block.addQuestion(new Question(question));
                });
            });
        }

        // Atualizar UI
        if (window.questionnaireManager.ui) {
            window.questionnaireManager.ui.render();
        }

        this.showSuccess('Questionário importado com sucesso!');
        
        // Limpar o input de arquivo
        const fileInput = document.getElementById('importQuestionnaireFile');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Esconder a seção de importação
        const importOptions = document.querySelector('.import-options');
        if (importOptions) {
            importOptions.classList.add('hidden');
        }
    }

    validateQuestionnaireFormat(data, format) {
        const questionTypeMap = {
            'NotAnswerableQuestion': 'Exibir Texto',
            'EditQuestion': 'Pergunta Texto',
            'OnlyOneChoiceQuestion': 'Múltipla Escolha (Resposta Única)',
            'MultipleChoiceQuestion': 'Múltipla Escolha (Respostas Múltiplas)',
            'GeoLocationQuestion': 'Localização Geográfica',
            'PearsonCreatorQuestion': 'Criar indivíduos',
            'ReplicationQuestion': 'Pergunta de Repetição',
            'ReplicableItemQuestion': 'Pergunta Item de Repetição',
            'MediaQuestion': 'Exibir Mídia'
        };

        let logs = [];
        const log = (message) => {
            console.log(message);
            logs.push(message);
        };

        if (!data || typeof data !== 'object') {
            this.showError('Dados inválidos ou não é um objeto');
            return false;
        }

        // Normalizar o formato para minúsculas
        format = format.toLowerCase();

        if (format === 'equest2') {
            if (!Array.isArray(data)) {
                this.showError('Dados não são um array');
                return false;
            }
            
            if (data.length === 0) {
                this.showError('Array vazio');
                return false;
            }

            try {
                data.forEach((blockObj, blockIndex) => {
                    if (!blockObj || typeof blockObj !== 'object') {
                        throw new Error('Bloco não é um objeto válido');
                    }
                    
                    const keys = Object.keys(blockObj);
                    if (keys.length === 0) {
                        throw new Error('Bloco não tem chaves');
                    }
                    
                    const blockTitle = keys[0];
                    const questions = blockObj[blockTitle];
                    
                    if (!Array.isArray(questions)) {
                        throw new Error('Perguntas não são um array');
                    }
                    
                    if (questions.length === 0) {
                        throw new Error(`O bloco \"${blockTitle}\" não tem perguntas`);
                    }

                    questions.forEach((q, qIndex) => {
                        const questionId = q.id || `índice: ${qIndex + 1}`; // Usar índice se ID não existir
                        const friendlyType = questionTypeMap[q.type] || q.type; // Obter nome amigável

                        if (!q || typeof q !== 'object') {
                            throw new Error(`Pergunta não é um objeto válido (ID: ${questionId})`);
                        }
                        
                        // Campos obrigatórios
                        if (!q.id) throw new Error(`Pergunta não tem ID (Tipo: ${friendlyType}, índice: ${qIndex + 1})`);
                        if (!q.title) throw new Error(`Pergunta não tem título (ID: ${questionId}, Tipo: ${friendlyType})`);
                        if (!q.type) throw new Error(`Pergunta não tem tipo (ID: ${questionId})`);
                        
                        // Validação específica por tipo
                        switch (q.type) {
                            case 'OnlyOneChoiceQuestion':
                            case 'MultipleChoiceQuestion':
                                const options = Object.keys(q).filter(key => key.startsWith('Op') && key !== 'OpOther');
                                if (options.length === 0) {
                                    throw new Error(`Pergunta \"${q.title}\" (ID: ${questionId}, Tipo: ${friendlyType}) não tem opções.`);
                                }
                                break;
                        }
                    });
                });
            } catch (error) {
                this.showError(`Validação falhou: ${error.message}`);
                return false;
            }
            
            return true;
        } else if (format === 'equest3') {
            if (!data.title || !data.blocks) {
                this.showError('Dados não têm título ou blocos');
                return false;
            }
            
            try {
                if (!Array.isArray(data.blocks)) {
                    throw new Error('Blocos não são um array');
                }

                data.blocks.forEach((block, blockIndex) => {
                    if (!block.title) {
                        throw new Error(`Bloco ${blockIndex + 1} não tem título`);
                    }

                    if (!Array.isArray(block.questions)) {
                        throw new Error(`Bloco "${block.title}" não tem array de perguntas`);
                    }

                    block.questions.forEach((q, qIndex) => {
                        const questionId = q.id || `índice: ${qIndex + 1}`;
                        const friendlyType = questionTypeMap[q.type] || q.type;

                        if (!q || typeof q !== 'object') {
                            throw new Error(`Pergunta não é um objeto válido (ID: ${questionId})`);
                        }

                        // Campos obrigatórios
                        if (!q.id) throw new Error(`Pergunta não tem ID (Tipo: ${friendlyType}, índice: ${qIndex + 1})`);
                        if (!q.title) throw new Error(`Pergunta não tem título (ID: ${questionId}, Tipo: ${friendlyType})`);
                        if (!q.type) throw new Error(`Pergunta não tem tipo (ID: ${questionId})`);

                        // Validação específica por tipo
                        switch (q.type) {
                            case 'OnlyOneChoiceQuestion':
                            case 'MultipleChoiceQuestion':
                                if (!q.Options || Object.keys(q.Options).length === 0) {
                                    throw new Error(`Pergunta "${q.title}" (ID: ${questionId}, Tipo: ${friendlyType}) não tem opções.`);
                                }
                                break;
                        }
                    });
                });
            } catch (error) {
                this.showError(`Validação falhou: ${error.message}`);
                return false;
            }
            
            return true;
        }

        this.showError('Formato não reconhecido. Formatos aceitos: eQuest2, eQuest3');
        return false;
    }

    showError(message, error = null) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '20px';
        errorDiv.style.right = '20px';
        errorDiv.style.backgroundColor = '#fff';
        errorDiv.style.padding = '20px';
        errorDiv.style.borderRadius = '8px';
        errorDiv.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        errorDiv.style.zIndex = '1000';
        errorDiv.style.minWidth = '300px';
        errorDiv.style.maxWidth = '600px';
        errorDiv.style.display = 'flex';
        errorDiv.style.flexDirection = 'column';

        // Criar container para os logs
        const logsContainer = document.createElement('div');
        logsContainer.className = 'logs-container';
        logsContainer.style.padding = '10px';
        logsContainer.style.backgroundColor = '#f8f9fa';
        logsContainer.style.borderRadius = '4px';
        logsContainer.style.fontFamily = 'monospace';
        logsContainer.style.whiteSpace = 'pre-wrap';
        logsContainer.style.fontSize = '12px';
        logsContainer.style.border = '1px solid #dee2e6';
        logsContainer.style.marginBottom = '10px';

        // Criar o conteúdo da mensagem de erro
        const errorContent = document.createElement('div');
        errorContent.className = 'error-content';
        errorContent.style.display = 'flex';
        errorContent.style.alignItems = 'flex-start';
        errorContent.style.gap = '10px';
        errorContent.style.marginBottom = '10px';

        const errorIcon = document.createElement('i');
        errorIcon.className = 'fas fa-exclamation-circle';
        errorIcon.style.color = '#dc3545';
        errorIcon.style.fontSize = '20px';
        errorIcon.style.marginTop = '2px';
        errorIcon.style.flexShrink = '0';

        const errorText = document.createElement('span');
        errorText.textContent = message;
        errorText.style.flex = '1';

        errorContent.appendChild(errorIcon);
        errorContent.appendChild(errorText);

        // Botão de fechar
        const closeButton = document.createElement('button');
        closeButton.className = 'error-close';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '10px';
        closeButton.style.right = '10px';
        closeButton.style.background = 'none';
        closeButton.style.border = 'none';
        closeButton.style.cursor = 'pointer';
        closeButton.style.padding = '5px';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';

        closeButton.addEventListener('click', () => {
            errorDiv.remove();
        });

        // Montar a mensagem
        errorDiv.appendChild(errorContent);
        errorDiv.appendChild(closeButton);

        // Adicionar ao DOM
        document.body.appendChild(errorDiv);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
            <button class="success-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(successDiv);

        successDiv.querySelector('.success-close').addEventListener('click', () => {
            successDiv.remove();
        });
    }

    deleteBlock() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        // Criar modal de confirmação
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '400px';
        modalContent.style.width = '100%';

        const title = document.createElement('h3');
        title.textContent = 'Confirmar Exclusão';
        title.style.marginBottom = '15px';
        title.style.color = '#dc3545';

        const message = document.createElement('p');
        message.textContent = `Tem certeza que deseja excluir o bloco "${block.title}"? Esta ação não pode ser desfeita.`;
        message.style.marginBottom = '20px';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Excluir';
        confirmButton.style.padding = '8px 16px';
        confirmButton.style.backgroundColor = '#dc3545';
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);

        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Função para remover o modal
        const removeModal = () => {
            document.body.removeChild(modal);
        };

        // Event listeners para os botões
        cancelButton.addEventListener('click', removeModal);
        confirmButton.addEventListener('click', () => {
            // Remover o bloco
            const blockIndex = this.questionnaireManager.questionnaire.blocks.findIndex(b => b.id === this.currentBlockId);
            if (blockIndex !== -1) {
                this.questionnaireManager.questionnaire.blocks.splice(blockIndex, 1);
                this.currentBlockId = null;
                this.render();
                this.showSuccess('Bloco excluído com sucesso!');
            }
            removeModal();
        });
    }

    editQuestion(questionId) {
        if (!this.currentBlockId) return;
        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const question = block.questions.find(q => q.id === questionId);
        if (question) {
            this.currentQuestionId = questionId;
            this.showQuestionForm(question);
        }
    }

    deleteQuestion(questionId) {
        if (!this.currentBlockId) return;
        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        const question = block.questions.find(q => q.id === questionId);
        if (!question) return;

        // Modal de confirmação para exclusão de pergunta
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';

        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '8px';
        modalContent.style.maxWidth = '400px';
        modalContent.style.width = '100%';

        const title = document.createElement('h3');
        title.textContent = 'Confirmar Exclusão de Pergunta';
        title.style.marginBottom = '15px';
        title.style.color = '#dc3545';

        const message = document.createElement('p');
        message.textContent = `Tem certeza que deseja excluir a pergunta "${question.title}"? Esta ação não pode ser desfeita.`;
        message.style.marginBottom = '20px';

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '10px';
        buttonContainer.style.justifyContent = 'flex-end';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancelar';
        cancelButton.style.padding = '8px 16px';
        cancelButton.style.backgroundColor = '#6c757d';
        cancelButton.style.color = 'white';
        cancelButton.style.border = 'none';
        cancelButton.style.borderRadius = '4px';
        cancelButton.style.cursor = 'pointer';

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Excluir';
        confirmButton.style.padding = '8px 16px';
        confirmButton.style.backgroundColor = '#dc3545';
        confirmButton.style.color = 'white';
        confirmButton.style.border = 'none';
        confirmButton.style.borderRadius = '4px';
        confirmButton.style.cursor = 'pointer';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(confirmButton);

        modalContent.appendChild(title);
        modalContent.appendChild(message);
        modalContent.appendChild(buttonContainer);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        const removeModal = () => {
            document.body.removeChild(modal);
        };

        cancelButton.addEventListener('click', removeModal);
        confirmButton.addEventListener('click', () => {
            block.questions = block.questions.filter(q => q.id !== questionId);
            block.saveVersion('Exclusão de pergunta');
            this.render();
            this.showSuccess('Pergunta excluída com sucesso!');
            removeModal();
        });
    }

    selectBlock(blockId) {
        console.log('[UI] Selecionando bloco:', blockId);
        this.currentBlockId = blockId;
        
        // Atualizar a UI para mostrar o bloco selecionado
        const blocks = document.querySelectorAll('.tree-item');
        blocks.forEach(block => {
            if (block.dataset.blockId === blockId) {
                block.classList.add('selected');
            } else {
                block.classList.remove('selected');
            }
        });

        // Mostrar o formulário de pergunta
        this.questionForm.classList.remove('hidden-inline');
        
        // Renderizar as perguntas do bloco
        this.render();
        
        // Scroll para o formulário de pergunta
        this.questionForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    loadQuestionnaire() {
        console.log('[UI] Carregando questionário');
        const questionnaire = this.questionnaireManager.questionnaire;
        
        // Renderizar blocos
        this.blocksTree.innerHTML = '';
        questionnaire.blocks.forEach(block => {
            const blockElement = this.createBlockElement(block);
            this.blocksTree.appendChild(blockElement);
        });

        // Se houver um bloco selecionado, renderizar suas perguntas
        if (this.currentBlockId) {
            console.log('[UI] Renderizando perguntas do bloco selecionado:', this.currentBlockId);
            this.render();
        }
    }

    renderQuestionDetails(question) {
        let details = '';

        // ID
        details += `<div class="detail-item">
            <span class="detail-label">ID:</span>
            <span class="detail-value">${question.id}</span>
        </div>`;

        // Título
        details += `<div class="detail-item">
            <span class="detail-label">Título:</span>
            <span class="detail-value">${question.title}</span>
        </div>`;

        // Tipo
        details += `<div class="detail-item">
            <span class="detail-label">Tipo:</span>
            <span class="detail-value">${question.type}</span>
        </div>`;

        // Comportamento
        if (question.behavior) {
            details += `<div class="detail-item">
                <span class="detail-label">Comportamento:</span>
                <span class="detail-value">${question.behavior}</span>
            </div>`;
        }

        // Mídia
        if (question.media) {
            details += `<div class="detail-item">
                <span class="detail-label">Mídia:</span>
                <span class="detail-value">${question.media}</span>
            </div>`;
        }

        // Tamanho
        if (question.size) {
            details += `<div class="detail-item">
                <span class="detail-label">Tamanho:</span>
                <span class="detail-value">${question.size}</span>
            </div>`;
        }

        // Referência
        if (question.reference) {
            details += `<div class="detail-item">
                <span class="detail-label">Referência:</span>
                <span class="detail-value">${question.reference}</span>
            </div>`;
        }

        // Replicação
        if (question.replication) {
            details += `<div class="detail-item">
                <span class="detail-label">Replicação:</span>
                <span class="detail-value">${question.replication}</span>
            </div>`;
        }

        // Opções
        if (question.Options && Object.keys(question.Options).length > 0) {
            details += `<div class="detail-item">
                <span class="detail-label">Opções:</span>
                <div class="detail-value options-list">
                    ${Object.entries(question.Options).map(([key, value]) => `
                        <div class="option-item">
                            <span class="option-key">${key}:</span>
                            <span class="option-value">${value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // Outra Opção
        if (question.OpOther) {
            details += `<div class="detail-item">
                <span class="detail-label">Outra Opção:</span>
                <span class="detail-value">${question.OpOther}</span>
            </div>`;
        }

        // Campos booleanos
        const booleanFields = [
            { key: 'allowOnlyNumbers', label: 'Permitir apenas números' },
            { key: 'showDontKnow', label: 'Mostrar "Não sei"' },
            { key: 'showDontAnswer', label: 'Mostrar "Não responder"' },
            { key: 'showDontApply', label: 'Mostrar "Não se aplica"' }
        ];

        const activeBooleanFields = booleanFields.filter(field => question[field.key]);
        if (activeBooleanFields.length > 0) {
            details += `<div class="detail-item">
                <span class="detail-label">Configurações:</span>
                <div class="detail-value boolean-list">
                    ${activeBooleanFields.map(field => `
                        <div class="boolean-item">
                            <i class="fas fa-check"></i>
                            <span>${field.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        // Dependências
        if (question.dependencies && question.dependencies.length > 0) {
            details += `<div class="detail-item">
                <span class="detail-label">Dependências:</span>
                <div class="detail-value dependencies-list">
                    ${question.dependencies.map(dep => `
                        <div class="dependency-item">
                            <span class="dependency-question">${dep.question}</span>
                            <span class="dependency-operator">${dep.operator}</span>
                            <span class="dependency-value">${dep.value}</span>
                        </div>
                    `).join('')}
                </div>
            </div>`;
        }

        return details;
    }

    expandAllQuestions() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        block.questions.forEach(question => {
            question.isExpanded = true;
        });

        this.renderQuestions();
    }

    collapseAllQuestions() {
        if (!this.currentBlockId) return;

        const block = this.questionnaireManager.questionnaire.getBlock(this.currentBlockId);
        if (!block) return;

        block.questions.forEach(question => {
            question.isExpanded = false;
        });

        this.renderQuestions();
    }
}