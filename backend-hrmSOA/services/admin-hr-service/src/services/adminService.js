const axios = require('axios');
const { IDENTITY_SERVICE_URL, PROFILE_SERVICE_URL } = require('../config/services');

async function listEmployees(token) {
  const headers = { Authorization: `Bearer ${token}` };
  const [usersRes, profilesRes] = await Promise.all([
    axios.get(`${IDENTITY_SERVICE_URL}/users`, { headers }),
    axios.get(`${PROFILE_SERVICE_URL}/profiles`, { headers })
  ]);
  const users = usersRes.data || [];
  const profiles = profilesRes.data || [];
  const profileByUserId = new Map(profiles.map((p) => [String(p.user_id), p]));
  return users.map((u) => ({
    ...u,
    profile: profileByUserId.get(String(u.id)) || null
  }));
}

async function getEmployee(token, id) {
  const headers = { Authorization: `Bearer ${token}` };
  const [userRes, profileRes] = await Promise.all([
    axios.get(`${IDENTITY_SERVICE_URL}/users/${id}`, { headers }),
    axios.get(`${PROFILE_SERVICE_URL}/profiles/${id}`, { headers })
  ]);
  return { ...userRes.data, profile: profileRes.data || null };
}

module.exports = { listEmployees, getEmployee };

