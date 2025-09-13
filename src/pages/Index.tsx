import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { RestaurantSelector } from "@/components/RestaurantSelector";
import { MenuManager } from "@/components/MenuManager";

type AppState = "login" | "restaurant-select" | "menu-manager";

interface AppData {
  user?: string;
  restaurantId?: string;
  restaurantName?: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>("login");
  const [appData, setAppData] = useState<AppData>({});

  const handleLogin = (username: string, password: string) => {
    // В реальном приложении здесь будет API вызов
    console.log("Login attempt:", { username, password });
    setAppData({ user: username });
    setAppState("restaurant-select");
  };

  const handleRestaurantSelect = (restaurantId: string) => {
    // В реальном приложении здесь будет запрос информации о ресторане
    const restaurantNames: { [key: string]: string } = {
      "1": "Ресторан Центральный",
      "2": "Кафе на Набережной", 
      "3": "Бистро Европейское",
      "4": "Ресторан Семейный"
    };
    
    setAppData(prev => ({
      ...prev,
      restaurantId,
      restaurantName: restaurantNames[restaurantId] || "Неизвестный ресторан"
    }));
    setAppState("menu-manager");
  };

  const handleBackToRestaurants = () => {
    setAppState("restaurant-select");
    setAppData(prev => ({ ...prev, restaurantId: undefined, restaurantName: undefined }));
  };

  const handleLogout = () => {
    setAppState("login");
    setAppData({});
  };

  if (appState === "login") {
    return <LoginForm onLogin={handleLogin} />;
  }

  if (appState === "restaurant-select") {
    return (
      <RestaurantSelector 
        restaurants={[]}
        onSelect={handleRestaurantSelect}
        onLogout={handleLogout}
      />
    );
  }

  if (appState === "menu-manager" && appData.restaurantId && appData.restaurantName) {
    return (
      <MenuManager
        restaurantId={appData.restaurantId}
        restaurantName={appData.restaurantName}
        onBack={handleBackToRestaurants}
      />
    );
  }

  return null;
};

export default Index;
