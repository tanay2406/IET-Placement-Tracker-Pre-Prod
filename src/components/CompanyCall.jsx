import { useParams } from "react-router-dom";

export default function CompanyCall() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold">
        1:1 Call Page for Company ID: {id}
      </h1>
    </div>
  );
}
