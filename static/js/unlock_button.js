 const checkboxes = document.querySelectorAll('#submission-checkboxes input[type="checkbox"]');
  const submitButton = document.getElementById('submit-button');

  function updateSubmitButtonState() {
    const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
    submitButton.disabled = !allChecked;
  }

  checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', updateSubmitButtonState);
  });

  // Initial check on page load
  updateSubmitButtonState();
