import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Search, ChefHat, Clock, CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  description?: string;
}

interface MenuManagerProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
}

// Мок-данные для демонстрации
const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Борщ украинский", category: "Супы", price: 450, isAvailable: true, description: "С говядиной и сметаной" },
  { id: "2", name: "Солянка мясная", category: "Супы", price: 520, isAvailable: false },
  { id: "3", name: "Цезарь с курицей", category: "Салаты", price: 680, isAvailable: true },
  { id: "4", name: "Греческий салат", category: "Салаты", price: 590, isAvailable: true },
  { id: "5", name: "Стейк из говядины", category: "Горячее", price: 1850, isAvailable: false },
  { id: "6", name: "Филе лосося", category: "Горячее", price: 1420, isAvailable: true },
  { id: "7", name: "Паста карбонара", category: "Горячее", price: 780, isAvailable: true },
  { id: "8", name: "Тирамису", category: "Десерты", price: 420, isAvailable: true },
  { id: "9", name: "Чизкейк", category: "Десерты", price: 380, isAvailable: false },
  { id: "10", name: "Брускетта", category: "Закуски", price: 320, isAvailable: true },
];

export const MenuManager = ({ restaurantName, onBack }: MenuManagerProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {};
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredItems]);

  const toggleItemStatus = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = !item.isAvailable;
        toast({
          title: newStatus ? "Блюдо добавлено" : "Блюдо убрано в стоп",
          description: `${item.name} ${newStatus ? "теперь доступно" : "временно недоступно"}`,
          variant: newStatus ? "default" : "destructive",
        });
        return { ...item, isAvailable: newStatus };
      }
      return item;
    }));
  };

  const availableCount = menuItems.filter(item => item.isAvailable).length;
  const totalCount = menuItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Назад
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <ChefHat className="w-6 h-6 text-primary" />
                  {restaurantName}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Доступно {availableCount} из {totalCount} блюд
                </p>
              </div>
            </div>
            
            <Badge variant="outline" className="bg-primary/10 border-primary/20">
              <Clock className="w-3 h-3 mr-1" />
              Онлайн
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Search */}
        <Card className="mb-6 border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Поиск блюд..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-background/50 border-border/50 focus:bg-background transition-colors"
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Categories */}
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <Card key={category} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-foreground flex items-center justify-between">
                  {category}
                  <Badge variant="secondary" className="bg-muted/50">
                    {items.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 ${
                      item.isAvailable
                        ? "bg-success-light/30 border-success/20 hover:border-success/40"
                        : "bg-warning-light/30 border-warning/20 hover:border-warning/40"
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`font-medium ${
                          item.isAvailable ? "text-foreground" : "text-muted-foreground line-through"
                        }`}>
                          {item.name}
                        </h3>
                        {item.isAvailable ? (
                          <CheckCircle className="w-4 h-4 text-success" />
                        ) : (
                          <XCircle className="w-4 h-4 text-warning" />
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {item.description}
                        </p>
                      )}
                      
                      <p className="text-lg font-semibold text-primary">
                        {item.price}₽
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 ml-4">
                      <span className={`text-sm font-medium ${
                        item.isAvailable ? "text-success" : "text-warning"
                      }`}>
                        {item.isAvailable ? "Доступно" : "Стоп"}
                      </span>
                      
                      <Switch
                        checked={item.isAvailable}
                        onCheckedChange={() => toggleItemStatus(item.id)}
                        className="data-[state=checked]:bg-success"
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Блюда не найдены
              </h3>
              <p className="text-muted-foreground">
                Попробуйте изменить поисковой запрос
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};