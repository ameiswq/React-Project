import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {validateImageFile, blobToDataUrl, compressImageWithWorker} from "../../services/fileService.js";
import "./profile.css";

export default function ProfilePage() {
  const { user, logout, avatar, updateAvatar } = useAuth();
  const workerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const worker = new Worker(new URL("../../workers/imageWorker.js", import.meta.url), { type: "module" });
    workerRef.current = worker;

    return () => {
      worker.terminate();
    };
  }, []);

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-content">
          <h1 className="profile-title">You are not logged in</h1>
          <p>Please log in to see and edit your profile.</p>
          <Link to="/login" className="btn primary">Go to login</Link>
        </div>
      </div>
    );
  }

  const initial = user.email ? user.email[0].toUpperCase() : "?";

  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!validateImageFile(file)) return;

    try {
      const worker = workerRef.current;
      const { fileBuffer, type } = await compressImageWithWorker(worker, file, {maxWidth: 512, maxHeight: 512, quality: 0.7});

      const blob = new Blob([fileBuffer], { type });
      const dataUrl = await blobToDataUrl(blob);
      updateAvatar(dataUrl);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Error compressing image:", err);
    }
  }

  function handleAvatarClick() {
    if (fileInputRef.current) fileInputRef.current.click();
  }

  async function handleLogout() {
    await logout();
  }

  return (
    <div className="profile-page">
      <div className="profile-content">
        <div className="profile-header">
          <button
            type="button"
            className="profile-avatar-btn"
            onClick={handleAvatarClick}
          >
            <div className="profile-avatar">
              {avatar ? <img src={avatar} alt="Profile" /> : <span>{initial}</span>}
            </div>
            <span className="avatar-hint">Change photo</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />

          <div className="profile-header-text">
            <h1>Your profile</h1>
            <p>Rick &amp; Morty account</p>
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-row">
            <span className="label">Email</span>
            <span className="value">{user.email}</span>
          </div>
          <div className="profile-row">
            <span className="label">User ID</span>
            <span className="value">{user.uid}</span>
          </div>
        </div>

        <div className="profile-actions">
          <Link to="/" className="btn">Back to search</Link>
          <button className="btn danger" onClick={handleLogout}>Log out</button>
        </div>
      </div>
    </div>
  );
}
