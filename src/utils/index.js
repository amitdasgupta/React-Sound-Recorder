export function giveMinutesAndSecondsFromSeconds(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return { minutes, seconds };
}
