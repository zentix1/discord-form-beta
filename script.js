class FormMaker {
    constructor() {
        this.formFields = [];
        this.publishedFormId = null;
        this.webhookUrl = null;

        this.initEventListeners();
        this.loadSavedForm();
        this.setupThemeToggle();
    }

    initEventListeners() {
        document.getElementById('add-text-field').addEventListener('click', () => this.addField('text'));
        document.getElementById('add-email-field').addEventListener('click', () => this.addField('email'));
        document.getElementById('add-textarea-field').addEventListener('click', () => this.addField('textarea'));
        document.getElementById('save-form').addEventListener('click', () => this.saveForm());
        document.getElementById('publish-form').addEventListener('click', () => this.showWebhookModal());
        document.getElementById('confirm-webhook').addEventListener('click', () => this.publishForm());
        document.getElementById('cancel-webhook').addEventListener('click', () => this.hideWebhookModal());
    }

    addField(type) {
        const field = {
            id: Date.now(),
            type,
            label: `${type.charAt(0).toUpperCase() + type.slice(1)} Input`,
            placeholder: `Enter ${type} here`
        };

        this.formFields.push(field);
        this.renderFormFields();
    }

    renderFormFields() {
        const container = document.getElementById('form-fields');
        container.innerHTML = '';

        this.formFields.forEach((field, index) => {
            const fieldElement = document.createElement('div');
            fieldElement.classList.add('form-field');
            fieldElement.innerHTML = `
                <select data-field-prop="type">
                    <option value="text" ${field.type === 'text' ? 'selected' : ''}>Text</option>
                    <option value="email" ${field.type === 'email' ? 'selected' : ''}>Email</option>
                    <option value="textarea" ${field.type === 'textarea' ? 'selected' : ''}>Textarea</option>
                </select>
                <input type="text" value="${field.label}" data-field-prop="label">
                <input type="text" value="${field.placeholder}" data-field-prop="placeholder">
                <button class="move-up" ${index === 0 ? 'disabled' : ''}>⬆️</button>
                <button class="move-down" ${index === this.formFields.length - 1 ? 'disabled' : ''}>⬇️</button>
                <button class="delete-field">❌</button>
            `;

            fieldElement.querySelector('select').addEventListener('change', (e) => {
                this.formFields[index].type = e.target.value;
            });

            fieldElement.querySelectorAll('input[data-field-prop]').forEach(input => {
                input.addEventListener('input', (e) => {
                    const prop = e.target.getAttribute('data-field-prop');
                    this.formFields[index][prop] = e.target.value;
                });
            });

            fieldElement.querySelector('.move-up').addEventListener('click', () => this.moveField(index, -1));
            fieldElement.querySelector('.move-down').addEventListener('click', () => this.moveField(index, 1));
            fieldElement.querySelector('.delete-field').addEventListener('click', () => this.deleteField(index));

            container.appendChild(fieldElement);
        });
    }

    moveField(index, direction) {
        const newIndex = index + direction;
        if (newIndex >= 0 && newIndex < this.formFields.length) {
            [this.formFields[index], this.formFields[newIndex]] = [this.formFields[newIndex], this.formFields[index]];
            this.renderFormFields();
        }
    }

    deleteField(index) {
        this.formFields.splice(index, 1);
        this.renderFormFields();
    }

    saveForm() {
        localStorage.setItem('savedForm', JSON.stringify({
            formFields: this.formFields,
            publishedFormId: this.publishedFormId,
            webhookUrl: this.webhookUrl
        }));
        alert('Form saved successfully!');
    }

    loadSavedForm() {
        const savedData = localStorage.getItem('savedForm');
        if (savedData) {
            const { formFields, publishedFormId, webhookUrl } = JSON.parse(savedData);
            this.formFields = formFields;
            this.publishedFormId = publishedFormId;
            this.webhookUrl = webhookUrl;
            this.renderFormFields();
        }
    }

    showWebhookModal() {
        document.getElementById('webhook-modal').classList.remove('hidden');
    }

    hideWebhookModal() {
        document.getElementById('webhook-modal').classList.add('hidden');
    }

    publishForm() {
        const webhookUrl = document.getElementById('webhook-url').value;
        if (!webhookUrl) {
            alert('Please enter a valid webhook URL');
            return;
        }

        this.publishedFormId = this.generateUniqueId();
        this.webhookUrl = webhookUrl;
        this.saveForm();

        const publishedLink = `https://form.blazelabs.online/${this.publishedFormId}`;
        alert(`Form published! Your unique link is: ${publishedLink}`);
        this.hideWebhookModal();
    }

    generateUniqueId() {
        return Math.random().toString(36).substring(2, 10);
    }

    setupThemeToggle() {
        const themeSwitch = document.getElementById('theme-switch');
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);

        themeSwitch.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
}

// Initialize the FormMaker when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new FormMaker();
});
