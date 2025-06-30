import { useEffect, useState } from "react";
import axios from "axios";
import baseURL from "../constants/constant";
const Admin = () => {
  const [extensionDownloads, setExtensionDownloads] = useState<number | null>(null);
  const [userCount, setUserCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch extension download count
        const downloadRes = await axios.get(`${baseURL}/downloads/count/extension`);
        setExtensionDownloads(downloadRes.data.count);

        // Fetch user count
        const userRes = await axios.get(`${baseURL}/downloads/users/count`);
        setUserCount(userRes.data.users);
      } catch (err) {
        setError("Failed to fetch admin stats");
        console.error(err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-2">
        <p>
          <strong>Total Extension Downloads:</strong>{" "}
          {extensionDownloads !== null ? extensionDownloads : "Loading..."}
        </p>
        <p>
          <strong>Total Registered Users:</strong>{" "}
          {userCount !== null ? userCount : "Loading..."}
        </p>
      </div>
    </div>
  );
};

export default Admin;
