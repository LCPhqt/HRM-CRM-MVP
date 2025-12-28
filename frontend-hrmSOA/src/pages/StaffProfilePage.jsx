import React from "react";
import ProfilePage from "./ProfilePage";
import MainLayout from "../components/MainLayout";

export default function StaffProfilePage() {
  return (
    <MainLayout title="Hồ sơ cá nhân">
      <ProfilePage />
    </MainLayout>
  );
}
