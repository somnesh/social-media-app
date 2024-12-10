export default function CircularProgressBar({ progress }) {
  return (
    <div className="w-16 h-16">
      <svg className="w-fit h-fit" viewBox="0 0 100 100">
        <circle
          className="text-gray-200 stroke-current"
          strokeWidth="5"
          cx="50"
          cy="50"
          r="15"
          fill="transparent"
        ></circle>
        <circle
          className="text-blue-600 stroke-current"
          strokeWidth="5"
          strokeLinecap="round"
          cx="50"
          cy="50"
          r="15"
          fill="transparent"
          strokeDasharray={`${2 * Math.PI * 40}`}
          strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
          style={{ transition: "stroke-dashoffset 0.35s" }}
        ></circle>
      </svg>
    </div>
  );
}
