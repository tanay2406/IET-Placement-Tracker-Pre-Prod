import { useParams } from "react-router-dom";

export default function CompanyPYQ() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <h1 className="text-3xl font-bold">
        PYQ Page for Company ID: {id}
      </h1>
    </div>
  );
}
