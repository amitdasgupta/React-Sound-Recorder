export default function ProgressBar({ time, totalTime, className }) {
  const progress = time / totalTime;
  const width = 100 * Math.min(progress, 1);
  return (
    <div
      className={`h-full w-full  bg-gradient-to-b from-gray-900 via-purple-900 to-violet-600 relative ${className}`}
    >
      <div
        className={`absolute rounded-xl w-4 h-4  left-[${width}%] top-[50%] -translate-y-1/2 bg-[#796dcd]`}
        style={{ left: `${width}%` }}
      ></div>
    </div>
  );
}
