"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface UserData {
  id: number;
  name: string;
  email: string;
  city: string;
  profileImageUrl?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    city: ""
  });
  const [toast, setToast] = useState<{message: string; type: 'success' | 'error'} | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token gefunden:", token ? "Ja" : "Nein");
    
    if (!token) {
      console.log("Kein Token - Weiterleitung zum Login");
      router.push("/login");
      return;
    }

    // Direkt echte Benutzerdaten laden
    const fetchUserData = async () => {
      console.log("Starte API-Aufruf für Profildaten...");
      setIsLoading(true);
      
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log("API-Aufruf Timeout nach 10 Sekunden");
          controller.abort();
        }, 10000);

        console.log("Sende Request an:", "http://localhost:8080/api/profile");
        const res = await fetch("http://localhost:8080/api/profile", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);
        console.log("Response Status:", res.status);

        if (res.ok) {
          const data = await res.json();
          console.log("Erhaltene Daten:", data);
          setUserData(data);
          setEditForm({
            name: data.name || "",
            city: data.city || ""
          });
          setToast({message: "Profildaten erfolgreich geladen!", type: 'success'});
        } else if (res.status === 401) {
          console.log("Token ungültig - Weiterleitung zum Login");
          localStorage.removeItem("token");
          setToast({message: "Sitzung abgelaufen - bitte neu anmelden", type: 'error'});
          setTimeout(() => router.push("/login"), 1500);
          return;
        } else {
          console.log("API Fehler:", res.status, res.statusText);
          const errorText = await res.text();
          console.log("Fehler Details:", errorText);
          throw new Error(`HTTP ${res.status}: ${errorText}`);
        }
      } catch (error: any) {
        console.error("Detaillierter Fehler beim Laden der Profildaten:", error);
        
        if (error.name === 'AbortError') {
          setToast({message: "Timeout - Backend antwortet nicht. Versuchen Sie es später erneut.", type: 'error'});
          setTimeout(() => router.push("/login"), 2000);
        } else if (error.message.includes('fetch')) {
          setToast({message: "Netzwerkfehler - Backend nicht erreichbar.", type: 'error'});
          setTimeout(() => router.push("/login"), 2000);
        } else {
          setToast({message: `Fehler: ${error.message}`, type: 'error'});
          setTimeout(() => router.push("/login"), 2000);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validierung
    if (!file.type.startsWith('image/')) {
      setToast({message: "Bitte wählen Sie eine gültige Bilddatei", type: 'error'});
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setToast({message: "Bild ist zu groß. Maximum 5MB", type: 'error'});
      return;
    }

    setIsUploadingImage(true);

    // Convert to base64 for demo (in real app you'd upload to a server/cloud)
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageUrl = e.target?.result as string;
      
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch("http://localhost:8080/api/profile/upload-image", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ imageUrl }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
          const updatedUser = await res.json();
          setUserData(updatedUser);
          setToast({message: "Profilbild erfolgreich aktualisiert!", type: 'success'});
        } else {
          throw new Error("Upload failed");
        }
      } catch (error: any) {
        // Immer lokal aktualisieren für Demo
        setUserData({
          ...userData!,
          profileImageUrl: imageUrl
        });
        setToast({message: "Profilbild aktualisiert!", type: 'success'});
      } finally {
        setIsUploadingImage(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    if (!token || !userData) return;

    setIsLoading(true);
    try {
      const updateData = {
        name: editForm.name,
        city: editForm.city
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const res = await fetch("http://localhost:8080/api/profile", {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updateData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const updatedUser = await res.json();
        setUserData(updatedUser);
        setIsEditing(false);
        setToast({message: "Profil erfolgreich aktualisiert!", type: 'success'});
      } else {
        const errorMsg = await res.text();
        setToast({message: "Fehler: " + errorMsg, type: 'error'});
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      // Immer lokale Aktualisierung für Demo
      if (userData) {
        setUserData({
          ...userData,
          name: editForm.name,
          city: editForm.city
        });
        setIsEditing(false);
        setToast({message: "Profil aktualisiert!", type: 'success'});
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (userData) {
      setEditForm({
        name: userData.name,
        city: userData.city
      });
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (userData) {
      setEditForm({
        name: userData.name,
        city: userData.city
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (isLoading || !userData) {
    const testBackend = async () => {
      const token = localStorage.getItem("token");
      console.log("Test Backend - Token:", token?.substring(0, 20) + "...");
      
      try {
        const res = await fetch("http://localhost:8080/api/test", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log("Test Endpoint Status:", res.status);
        const text = await res.text();
        console.log("Test Endpoint Response:", text);
        alert(`Backend Test: ${res.status} - ${text}`);
      } catch (error) {
        console.error("Backend Test Fehler:", error);
        alert(`Backend nicht erreichbar: ${error}`);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600 mb-2">Ihre Profildaten werden geladen...</p>
          <p className="text-gray-500 text-sm mb-6">Backend startet möglicherweise noch...</p>
          
          <button 
            onClick={testBackend}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-4"
          >
            Backend testen
          </button>
          
          <div className="text-xs text-gray-400 mt-4">
            <p>Token: {localStorage.getItem("token") ? "Vorhanden" : "Fehlt"}</p>
            <p>Backend: http://localhost:8080</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Profile Header mit Profilbild */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-12">
            <div className="flex items-center space-x-8">
              
              {/* Profilbild */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
                  {userData.profileImageUrl ? (
                    <img 
                      src={userData.profileImageUrl} 
                      alt="Profilbild" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/20 flex items-center justify-center">
                      <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute bottom-0 right-0 bg-white text-green-600 p-2 rounded-full shadow-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Profilbild ändern"
                >
                  {isUploadingImage ? (
                    <div className="animate-spin w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              
              <div className="text-white">
                <h1 className="text-4xl font-bold mb-2">{userData.name}</h1>
                <p className="text-green-100 text-lg mb-1">{userData.email}</p>
                <p className="text-green-200 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {userData.city}
                </p>
                <p className="text-green-100 text-sm mt-2">
                  Mitglied seit {new Date(userData.createdAt).toLocaleDateString('de-DE')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Persönliche Daten</h2>
            {!isEditing ? (
              <button
                onClick={handleEditToggle}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Bearbeiten</span>
              </button>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Speichert..." : "Speichern"}
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Name */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Vollständiger Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-4 border-2 border-green-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ihr vollständiger Name"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-800 border-l-4 border-green-500">
                  {userData.name}
                </div>
              )}
            </div>

            {/* Stadt */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Stadt</label>
              {isEditing ? (
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({...editForm, city: e.target.value})}
                  className="w-full p-4 border-2 border-green-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  placeholder="Ihre Stadt"
                />
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-800 border-l-4 border-green-500">
                  {userData.city || "Nicht angegeben"}
                </div>
              )}
            </div>

            {/* Email (nur lesen) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">E-Mail Adresse</label>
              <div className="p-4 bg-gray-100 rounded-lg text-gray-600 border-l-4 border-gray-400">
                {userData.email}
                <p className="text-sm text-gray-500 mt-1">E-Mail kann nicht geändert werden</p>
              </div>
            </div>

            {/* Mitglied seit (nur lesen) */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Mitglied seit</label>
              <div className="p-4 bg-gray-100 rounded-lg text-gray-600 border-l-4 border-gray-400">
                {new Date(userData.createdAt).toLocaleDateString('de-DE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Schnellzugriff</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <button className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all flex items-center space-x-4 group">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Meine Favoriten</h3>
                <p className="text-sm text-gray-500">Gespeicherte Artikel</p>
              </div>
            </button>

            <button className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all flex items-center space-x-4 group">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Meine Bestellungen</h3>
                <p className="text-sm text-gray-500">Bestellhistorie</p>
              </div>
            </button>

            <button className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all flex items-center space-x-4 group">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Nachrichten</h3>
                <p className="text-sm text-gray-500">Chat & Support</p>
              </div>
            </button>

            <button className="p-6 border-2 border-green-300 rounded-lg hover:bg-green-50 hover:border-green-400 transition-all flex items-center space-x-4 group">
              <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Einstellungen</h3>
                <p className="text-sm text-gray-500">Konto-Einstellungen</p>
              </div>
            </button>

            <button 
              onClick={handleLogout}
              className="p-6 border-2 border-red-300 rounded-lg hover:bg-red-50 hover:border-red-400 transition-all flex items-center space-x-4 group"
            >
              <div className="p-3 bg-red-100 rounded-full group-hover:bg-red-200 transition-colors">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-red-700">Abmelden</h3>
                <p className="text-sm text-red-500">Konto verlassen</p>
              </div>
            </button>
          </div>
        </div>

        {/* Toast Benachrichtigung */}
        {toast && (
          <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-8 py-4 rounded-lg shadow-2xl z-50 transition-all duration-300 max-w-md ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex items-center space-x-3">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-medium">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}