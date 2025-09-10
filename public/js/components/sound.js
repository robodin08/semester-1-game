async function playSound({ name, volume = 1, startAt = 0 }) {
  // relative from /assets/sounds
  return new Promise((resolve) => {
    try {
      const audioElement = new Audio('/assets/sounds/' + name);
      audioElement.volume = volume;
      audioElement.currentTime = startAt;

      audioElement.addEventListener('canplaythrough', async () => {
        try {
          await audioElement.play();
          resolve(true);
        } catch (playError) {
          console.error('Audio play error:', playError);
          resolve(false);
        }
      });

      audioElement.addEventListener('error', (e) => {
        console.error('Audio load error:', e);
        resolve(false);
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      resolve(false);
    }
  });
}
