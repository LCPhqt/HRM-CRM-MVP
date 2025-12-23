import React, { useEffect, useState } from 'react';
import ProfileForm from '../components/ProfileForm';
import { useAuth } from '../context/AuthContext';

function ProfilePage() {
  const { client } = useAuth();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await client.get('/profiles/me');
        setProfile(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [client]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.put('/profiles/me', profile);
      alert('Đã lưu hồ sơ');
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-4">
        <div>
          <p className="text-sm text-slate-500">Hồ sơ cá nhân</p>
          <h1 className="text-2xl font-bold text-slate-800">Cập nhật thông tin</h1>
        </div>
        <ProfileForm profile={profile} onChange={handleChange} onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  );
}

export default ProfilePage;

