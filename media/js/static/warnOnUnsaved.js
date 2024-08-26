let isDirty = false;

const warnUnsavedChanges = (e) => {
    if (isDirty) {
        e.preventDefault();
        e.returnValue = true;
        return e.returnValue;
    }
};

window.addEventListener('beforeunload', warnUnsavedChanges);

document.addEventListener('DOMContentLoaded', () => {
    $('form').on('change', () => {
        isDirty = true;
    });

    $('button[type="submit"]').click(() => {
        isDirty = false;
    });
});
