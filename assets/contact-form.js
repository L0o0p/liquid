document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            // Only validate client-side if we're not already handling server validation
            if (!this.classList.contains('form--success')) {
                // Reset errors
                document.querySelectorAll('.error').forEach(error => {
                    error.style.display = 'none';
                });

                // Get form values
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const message = document.getElementById('message').value;

                // Validate form
                let isValid = true;

                if (!name.trim()) {
                    document.getElementById('nameError').style.display = 'block';
                    isValid = false;
                }

                if (!email.trim() || !isValidEmail(email)) {
                    document.getElementById('emailError').style.display = 'block';
                    isValid = false;
                }

                if (!message.trim()) {
                    document.getElementById('messageError').style.display = 'block';
                    isValid = false;
                }

                if (!isValid) {
                    e.preventDefault(); // Stop form submission if validation fails
                }
            }
        });
    }

    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
});