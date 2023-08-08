function calculateEndTime(
  startTime: string,
  numCycles: string,
  numIntervals: string
) {
  const start = new Date(startTime);
  const intervalMillis =
    start.getMinutes() * 60 * 1000 + start.getSeconds() * 1000;
  const totalIntervalMillis = intervalMillis * parseInt(numIntervals);
  const totalCyclesMillis = totalIntervalMillis * parseInt(numCycles);

  const endTimeMillis = start.getTime() + totalCyclesMillis;
  const endTime = new Date(endTimeMillis);
  return endTime.toLocaleDateString();
}

export default calculateEndTime;
