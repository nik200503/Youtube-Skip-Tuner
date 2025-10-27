const saveButton = document.getElementById('saveButton');
const skipTimeInput = document.getElementById('skipTime');
const status = document.getElementById('status');

// Load the currently saved value when the popup opens

(async () => {
  const data = await chrome.storage.sync.get({customSkipTime:5})
  skipTimeInput.value= data.customSkipTime;
})();

// Save the new value when the "Save" button is clicked
saveButton.addEventListener('click', async () => {
  const time = parseInt(skipTimeInput.value, 10);  
  if (time && time > 0) {
      try {
        await chrome.storage.sync.set({customSkipTime: time});

        status.textContent= `Saved! Skip time is ${time}`
      } catch (error) {
            status.textContent = "Error: Could not save.";
            throw  new error("cannot save something went wrong");
    }
  }
  else{
      status.textContent = "Please enter a number greater than 0.";
    }
});