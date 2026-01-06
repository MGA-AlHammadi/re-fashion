"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchProfile } from "../services/api";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Settings statesss
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: 'success' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  function showToast(message: string, type: 'success' | 'error' = 'success') {
    setToast({ show: true, message, type });
  }

  async function load() {
    setLoading(true);
    try {
      const data = await fetchProfile();
      setProfile(data);
      setName(data.name || "");
      setEmail(data.email || "");
    } catch (e: any) {
      if (e?.message === "NO_TOKEN") {
        router.push('/login');
        return;
      }
      showToast("Fehler beim Laden des Profils", 'error');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile(e: React.FormEvent) {
    e.preventDefault();
    showToast("Profil wurde aktualisiert", 'success');
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      showToast("Passwörter stimmen nicht überein", 'error');
      return;
    }
    
    if (newPassword.length < 6) {
      showToast("Passwort muss mindestens 6 Zeichen lang sein", 'error');
      return;
    }
    
    showToast("Passwort wurde geändert", 'success');
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleDeleteAccount() {
    if (confirm("Möchtest du dein Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.")) {
      showToast("Konto wird gelöscht...", 'error');
      // Implement account deletion
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-semibold">Lade Einstellungen…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-24 right-8 z-50 animate-slide-in-right">
          <div className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-sm ${
            toast.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
              : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'
          }`}>
            {toast.type === 'success' ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
            <span className="font-semibold">{toast.message}</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Einstellungen</h1>
          <p className="text-gray-600 text-lg">Verwalte dein Konto und deine Präferenzen</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <nav className="space-y-2">
                <a href="#profile" className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Profil</span>
                </a>
                <a href="#password" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Passwort</span>
                </a>
                <a href="#notifications" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span>Benachrichtigungen</span>
                </a>
                <a href="#danger" className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>Gefahrenzone</span>
                </a>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div id="profile" className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Profil Informationen</h2>
                  <p className="text-gray-600 text-sm">Aktualisiere deine persönlichen Daten</p>
                </div>
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-black"
                    placeholder="Dein Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">E-Mail</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-black"
                    placeholder="deine@email.com"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Profil aktualisieren
                </button>
              </form>
            </div>

            {/* Password Section */}
            <div id="password" className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Passwort ändern</h2>
                  <p className="text-gray-600 text-sm">Stelle sicher, dass dein Passwort sicher ist</p>
                </div>
              </div>

              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Aktuelles Passwort</label>
                  <input 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-black"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Neues Passwort</label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-black"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Passwort bestätigen</label>
                  <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all text-black"
                    placeholder="••••••••"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Passwort ändern
                </button>
              </form>
            </div>

            {/* Notifications Section */}
            <div id="notifications" className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Benachrichtigungen</h2>
                  <p className="text-gray-600 text-sm">Verwalte deine Benachrichtigungs-Einstellungen</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">E-Mail Benachrichtigungen</p>
                    <p className="text-sm text-gray-600">Erhalte Updates per E-Mail</p>
                  </div>
                  <button 
                    onClick={() => setEmailNotifications(!emailNotifications)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      emailNotifications ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Push Benachrichtigungen</p>
                    <p className="text-sm text-gray-600">Erhalte Push-Nachrichten</p>
                  </div>
                  <button 
                    onClick={() => setPushNotifications(!pushNotifications)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      pushNotifications ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      pushNotifications ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
                  <div>
                    <p className="font-semibold text-gray-900">Marketing E-Mails</p>
                    <p className="text-sm text-gray-600">Erhalte Angebote und News</p>
                  </div>
                  <button 
                    onClick={() => setMarketingEmails(!marketingEmails)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      marketingEmails ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-gray-300'
                    }`}
                  >
                    <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      marketingEmails ? 'translate-x-7' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div id="danger" className="bg-white rounded-2xl shadow-lg p-8 border-2 border-red-200">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-red-600">Gefahrenzone</h2>
                  <p className="text-gray-600 text-sm">Irreversible Aktionen</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                <h3 className="text-lg font-bold text-red-900 mb-2">Konto löschen</h3>
                <p className="text-sm text-red-700 mb-4">
                  Wenn du dein Konto löschst, werden alle deine Daten permanent entfernt. Diese Aktion kann nicht rückgängig gemacht werden.
                </p>
                <button 
                  onClick={handleDeleteAccount}
                  className="px-6 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-all"
                >
                  Konto permanent löschen
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
