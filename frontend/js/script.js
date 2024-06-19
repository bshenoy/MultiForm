document.addEventListener('DOMContentLoaded', function() {
    let currentPage = 0;
    const userId = localStorage.getItem('userId') || generateUserId();
    localStorage.setItem('userId', userId);

    const pages = [
        'pages/page1.html',
        'pages/page2.html',
        'pages/page3.html',
         'pages/page3.html',
        // Add paths for all pages up to page10.html
    ];

    function generateUserId() {
        return 'user-' + Math.random().toString(36).substr(2, 9);
    }

    function loadPage(pageIndex) {
        fetch(pages[pageIndex])
            .then(response => response.text())
            .then(html => {
                document.getElementById('form-container').innerHTML = html;
                // Attach event listeners after rendering page content
                document.getElementById('next').addEventListener('click', nextPage);
                document.getElementById('back').addEventListener('click', previousPage);
                // Optional: add form submit listener if needed
                document.getElementById('form').addEventListener('submit', saveData);
                retrieveData(); // Optional: retrieve saved data for current page
            })
            .catch(error => console.error('Error loading page:', error));
    }

    function nextPage() {
        if (validateForm()) {
            currentPage++;
            if (currentPage < pages.length) {
                loadPage(currentPage);
            } else {
                alert('Form completed!'); // Optionally handle form completion
                // Redirect or handle form completion as needed
            }
        } else {
            alert('Please fill all mandatory fields.');
        }
    }

    function previousPage() {
        if (currentPage > 0) {
            currentPage--;
            loadPage(currentPage);
        }
    }

    function validateForm() {
        const inputs = document.querySelectorAll('#form [required]');
        for (let input of inputs) {
            if (!input.value.trim()) {
                return false;
            }
        }
        return true;
    }

    // Optional: Save form data to backend
    async function saveData(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch('/api/form/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, data })
            });
            const result = await response.json();
            console.log(result.message);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Optional: Retrieve saved data from backend
    async function retrieveData() {
        try {
            const response = await fetch(`/api/form/retrieve/${userId}`);
            const result = await response.json();
            if (result.data) {
                const form = document.getElementById('form');
                for (const key in result.data) {
                    if (form[key]) {
                        form[key].value = result.data[key];
                    }
                }
            }
        } catch (error) {
            console.error('Error retrieving data:', error);
        }
    }

    loadPage(currentPage); // Start by loading the initial page
});
