document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 0;
    const userId = localStorage.getItem('userId') || generateUserId();
    localStorage.setItem('userId', userId);

    const pages = [
        'pages/page1.html',
        'pages/page2.html',
        'pages/page3.html',
        'pages/page4.html',
        'pages/page5.html',
        'pages/page6.html'
        // Add paths for all pages up to page10.html if needed
    ];

    function generateUserId() {
        return 'user-' + Math.random().toString(36).substr(2, 9);
    }

    function loadPage(pageIndex) {
        fetch(pages[pageIndex])
            .then(response => response.text())
            .then(html => {
                document.getElementById('form-container').innerHTML = html;
                attachValidationHandlers();
                document.getElementById('next').addEventListener('click', nextPage);
                document.getElementById('back').addEventListener('click', previousPage);
                if (pageIndex === 0) {
                    // Only for Page 1: Initialize form with retrieved data (if any)
                    retrieveData();
                }
            })
            .catch(error => console.error('Error loading page:', error));
    }

    function nextPage() {
        const form = document.querySelector('form');
        if (validateForm(form) && form.checkValidity()) {
            saveData(form);
        } else {
            alert('Please fill all mandatory fields.');
        }
    }

    function saveData(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        fetch('/api/form/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, data })
        })
        .then(response => response.json())
        .then(result => {
            console.log(result.message); // Log success message
            currentPage++;
            if (currentPage < pages.length) {
                loadPage(currentPage);
            } else {
                alert('Form completed!');
                // Optionally handle form completion
            }
        })
        .catch(error => {
            console.error('Error saving data:', error);
        });
    }

    function previousPage() {
        if (currentPage > 0) {
            currentPage--;
            loadPage(currentPage);
        }
    }

    function validateForm(form) {
        const inputs = form.querySelectorAll('[required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    function attachValidationHandlers() {
        const form = document.querySelector('form');
        if (form) {
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    const allValid = Array.from(inputs).every(input => input.checkValidity());
                    document.getElementById('next').disabled = !allValid;
                });
            });

            document.getElementById('next').disabled = !Array.from(inputs).every(input => input.checkValidity());
        }
    }

    function retrieveData() {
        fetch(`/api/form/retrieve/${userId}`)
            .then(response => response.json())
            .then(result => {
                if (result.data) {
                    const form = document.querySelector('form');
                    for (const key in result.data) {
                        if (form[key]) {
                            form[key].value = result.data[key];
                        }
                    }
                }
                // Re-enable next button after retrieving data
                document.getElementById('next').disabled = false;
            })
            .catch(error => {
                console.error('Error retrieving data:', error);
            });
    }

    loadPage(currentPage); // Start by loading the initial page
});
