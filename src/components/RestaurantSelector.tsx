import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Store, ArrowRight, MapPin } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  address: string;
  isActive: boolean;
}

interface RestaurantSelectorProps {
  restaurants: Restaurant[];
  onSelect: (restaurantId: string) => void;
}

// Мок-данные для демонстрации
const mockRestaurants: Restaurant[] = [
  { id: "1", name: "Ресторан Центральный", address: "ул. Ленина, 15", isActive: true },
  { id: "2", name: "Кафе на Набережной", address: "Набережная, 8", isActive: true },
  { id: "3", name: "Бистро Европейское", address: "пр. Мира, 42", isActive: false },
  { id: "4", name: "Ресторан Семейный", address: "ул. Пушкина, 23", isActive: true },
];

export const RestaurantSelector = ({ onSelect }: RestaurantSelectorProps) => {
  const restaurants = mockRestaurants;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8 pt-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary-glow rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
            <Store className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Выберите ресторан
          </h1>
          <p className="text-muted-foreground">
            Выберите точку для управления стоп-листом
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((restaurant) => (
            <Card
              key={restaurant.id}
              className={`group cursor-pointer transition-all duration-300 border-2 hover:shadow-xl hover:shadow-primary/10 ${
                restaurant.isActive
                  ? "border-transparent hover:border-primary/20 bg-card/80 backdrop-blur-sm"
                  : "border-muted bg-muted/30 opacity-60"
              }`}
              onClick={() => restaurant.isActive && onSelect(restaurant.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-foreground group-hover:text-primary transition-colors">
                    {restaurant.name}
                  </CardTitle>
                  {restaurant.isActive && (
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{restaurant.address}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                    restaurant.isActive
                      ? "bg-success-light text-success"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      restaurant.isActive ? "bg-success" : "bg-muted-foreground"
                    }`} />
                    {restaurant.isActive ? "Активен" : "Закрыт"}
                  </div>
                  
                  {restaurant.isActive && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover:text-primary hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelect(restaurant.id);
                      }}
                    >
                      Выбрать
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};