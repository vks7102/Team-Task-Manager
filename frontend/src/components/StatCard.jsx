export default function StatCard({ title, value, color }) {
  return (
    <div className={`${color} text-white rounded-lg shadow-md p-6 text-center`}>
      <p className="text-sm font-medium opacity-90">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
