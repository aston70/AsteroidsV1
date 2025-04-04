let currentSection = 1;
const totalSections = 5;

function resetHelpSections() {
  currentSection = 1;
  document.getElementById('modalButton').textContent = 'Next';  
}

function getSection(section) {
  return document.getElementById(`section${section}`);  
}

function showHelp() {
  
  let helpModalDiv = document.getElementById('helpModal');
  if (!helpModalDiv) {
    return;
  }
  
  if (!getSection(currentSection))
  {
    resetHelpSections();
  }
  
  let currentSectionDiv = getSection(currentSection);
  
  if (!currentSectionDiv) {
    return;
  }  
  
  helpModalDiv.style.display = 'block';
  currentSectionDiv.style.display = 'block';
  
  pauseGame = true;
}

function nextSection() {
    
  // Hide the current section
  getSection(currentSection).style.display = 'none';

  // Increment the section counter
  currentSection++;

  // If we're still within the available sections, show the next one
  if (currentSection <= totalSections) {
	  document.getElementById(`section${currentSection}`).style.display = 'block';
	  document.getElementById('modalButton').textContent = 
        currentSection === totalSections ? 'Close' : 'Next';
  } else {
	  // If we've gone past the last section, close the modal
	  document.getElementById('helpModal').style.display = 'none';
      pauseGame = false;
  }
}
