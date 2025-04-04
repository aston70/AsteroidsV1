let audioContext;

let soundsLoaded = {
  gameplaySound: false,
  bulletSound: false,
  spaceshipHitSound: false,
  asteroidHitSound: false,
  youWinSound: false,
  youLoseSound: false,
  thrustSound: false,
  ufoBulletSound: false,
  ufoHitSound: false
};

function loadSounds(callback) {
  
  if(!audioContext) {
    audioContext = getAudioContext();
  }
  
  if (audioContext.state === 'suspended') {
    audioContext.resume().then(() => {
      console.log("AudioContext is resumed and ready to use.");
    });
  }
  
  const sounds =  [
    { name: 'gameplaySound', file: 'sounds/game-play.wav' },
    { name: 'bulletSound', file: 'sounds/retro-laser-shot.wav' },
    { name: 'spaceshipHitSound', file: 'sounds/spaceship-hit.wav' },
    { name: 'asteroidHitSound', file: 'sounds/asteroid-hit.wav' },
    { name: 'youWinSound', file: 'sounds/you-win.wav' },
    { name: 'youLoseSound', file: 'sounds/you-lose.wav' },
    { name: 'thrustSound', file: 'sounds/thrust.wav' },
    { name: 'ufoBulletSound', file: 'sounds/ufo-laser-shot.wav' },
    { name: 'ufoHitSound', file: 'sounds/ufo-hit.wav' }
  ];

  let soundsLoadedCount = 0;

  sounds.forEach(sound => {
    window[sound.name] = loadSound(sound.file, () => {
      soundsLoaded[sound.name] = true;
      soundsLoadedCount++;

      // Check if all sounds are loaded
      if (soundsLoadedCount === sounds.length) {
        console.log("All " + soundsLoadedCount + " sounds are loaded.");
        
        // Call the callback function when all sounds are loaded
        if (callback) {
          callback();
        }
      }
    }, soundLoadError);
  });
}

function checkIfLoaded(callback)
{
  
  // Check if all sounds are loaded
  if (Object.values(soundsLoaded).every(loaded => loaded)) {
    
    console.log("All sounds are loaded.");
    
    // Call the callback function when all sounds are loaded.
    if (callback) {
      callback();
    }
    
  }
}

function gamePlaySoundLoaded() {
  console.log('Gameplay sound is ready to play!');
  playSound(gameplaySound, true);
}

function soundLoadError(err) {
  console.error("Error loading sound: ", err);
}

// Stop and unload all sounds to free up memory.
function unloadSounds(callback) {
 
  stopSound(gameplaySound);
  stopSound(bulletSound);
  stopSound(spaceshipHitSound);
  stopSound(asteroidHitSound);
  stopSound(youWinSound);
  stopSound(youLoseSound);
  stopSound(thrustSound);
  stopSound(ufoBulletSound);
  stopSound(ufoHitSound);

  // Free the memory by removing the sound references
  gameplaySound = null;
  bulletSound = null;
  spaceshipHitSound = null;
  asteroidHitSound = null;
  youWinSound = null;
  youLoseSound = null;
  thrustSound = null;
  ufoBulletSound = null;
  ufoHitSound = null;

  if(audioContext) {
    audioContext.suspend();
  }     
  
  console.log("Sounds unloaded and disconnected");
  
  // Call the callback function when all sounds are unloaded.
  if (callback) {
    callback();
  }
  
}

function playSound(sound, loop = false) {
  
  if (pauseGame) {
    return;
  }  
  
  try {
    if (audioContext && sound && !sound.isPlaying()) {
      if (loop) {
        sound.loop();  // Make sure loop() is called as a function
      } else {
        sound.play();
      }
    }
  } catch (ex) {
    console.log(ex);
  }
}

function stopSound(sound) {
  try {
    if (sound && sound.isPlaying()) {
      sound.stop();
    }
  } catch (ex) {
    console.log(ex);
  }
}
