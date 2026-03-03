import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-auth">
      <div className="flex flex-col items-center justify-center text-center bg-gray-50 border border-gray-200 shadow-sm rounded-xl px-12 py-10">
        <h1 className="text-6xl font-bold text-gray-800">404</h1>
        <p className="mt-4 text-xl text-gray-500">Page not found</p>
        <Link
          to="/dashboard"
          className="mt-6 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/80 transition"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
