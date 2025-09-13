import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ChefHat, Clock, CheckCircle, XCircle, ArrowLeft, Save, Plus, FolderPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  category: string;
  price: number;
  isAvailable: boolean;
  description?: string;
  image?: string;
}

interface CustomCategory {
  id: string;
  name: string;
  itemIds: string[];
}

interface MenuManagerProps {
  restaurantId: string;
  restaurantName: string;
  onBack: () => void;
}

// Мок-данные для демонстрации
const mockMenuItems: MenuItem[] = [
  { id: "1", name: "Борщ украинский", category: "Супы", price: 450, isAvailable: true, description: "С говядиной и сметаной", image: "/api/placeholder/120/80" },
  { id: "2", name: "Солянка мясная", category: "Супы", price: 520, isAvailable: false, image: "/api/placeholder/120/80" },
  { id: "3", name: "Цезарь с курицей", category: "Салаты", price: 680, isAvailable: true, image: "/api/placeholder/120/80" },
  { id: "4", name: "Греческий салат", category: "Салаты", price: 590, isAvailable: true, image: "/api/placeholder/120/80" },
  { id: "5", name: "Стейк из говядины", category: "Горячее", price: 1850, isAvailable: false, image: "/api/placeholder/120/80" },
  { id: "6", name: "Филе лосося", category: "Горячее", price: 1420, isAvailable: true, image: "/api/placeholder/120/80" },
  { id: "7", name: "Паста карбонара", category: "Горячее", price: 780, isAvailable: true, image: "/api/placeholder/120/80" },
  { id: "8", name: "Тирамису", category: "Десерты", price: 420, isAvailable: true, image: "/api/placeholder/120/80" },
  { id: "9", name: "Чизкейк", category: "Десерты", price: 380, isAvailable: false, image: "/api/placeholder/120/80" },
  { id: "10", name: "Брускетта", category: "Закуски", price: 320, isAvailable: true, image: "/api/placeholder/120/80" },
];

export const MenuManager = ({ restaurantName, onBack }: MenuManagerProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [originalItems, setOriginalItems] = useState<MenuItem[]>(mockMenuItems);
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  
  // Состояние для создания кастомной категории
  const [newCategoryName, setNewCategoryName] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  const groupedItems = useMemo(() => {
    const groups: { [key: string]: MenuItem[] } = {};
    
    // Добавляем обычные категории
    filteredItems.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    
    // Добавляем кастомные категории
    customCategories.forEach(customCat => {
      const categoryItems = menuItems.filter(item => 
        customCat.itemIds.includes(item.id) && 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      if (categoryItems.length > 0) {
        groups[`🔥 ${customCat.name}`] = categoryItems;
      }
    });
    
    return groups;
  }, [filteredItems, customCategories, menuItems, searchTerm]);

  const createCustomCategory = () => {
    if (!newCategoryName.trim() || selectedItems.length === 0) {
      toast({
        title: "Ошибка создания",
        description: "Введите название категории и выберите блюда",
        variant: "destructive",
      });
      return;
    }

    const newCategory: CustomCategory = {
      id: `custom-${Date.now()}`,
      name: newCategoryName,
      itemIds: [...selectedItems]
    };

    setCustomCategories(prev => [...prev, newCategory]);
    setNewCategoryName("");
    setSelectedItems([]);
    setIsCreateDialogOpen(false);
    setHasChanges(true);

    toast({
      title: "Категория создана",
      description: `Создана кастомная категория "${newCategoryName}"`,
    });
  };

  const deleteCustomCategory = (categoryId: string) => {
    setCustomCategories(prev => prev.filter(cat => cat.id !== categoryId));
    setHasChanges(true);
    toast({
      title: "Категория удалена",
      description: "Кастомная категория была удалена",
    });
  };

  const toggleItemStatus = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = !item.isAvailable;
        return { ...item, isAvailable: newStatus };
      }
      return item;
    }));
    setHasChanges(true);
  };

  const toggleCategoryStatus = (category: string) => {
    // Проверяем, кастомная ли это категория
    if (category.startsWith('🔥 ')) {
      const customCatName = category.replace('🔥 ', '');
      const customCategory = customCategories.find(cat => cat.name === customCatName);
      if (customCategory) {
        const categoryItems = menuItems.filter(item => customCategory.itemIds.includes(item.id));
        const hasAvailableItems = categoryItems.some(item => item.isAvailable);
        const newStatus = !hasAvailableItems;
        
        setMenuItems(prev => prev.map(item => {
          if (customCategory.itemIds.includes(item.id)) {
            return { ...item, isAvailable: newStatus };
          }
          return item;
        }));
      }
    } else {
      // Обычная категория
      const categoryItems = menuItems.filter(item => item.category === category);
      const hasAvailableItems = categoryItems.some(item => item.isAvailable);
      const newStatus = !hasAvailableItems;
      
      setMenuItems(prev => prev.map(item => {
        if (item.category === category) {
          return { ...item, isAvailable: newStatus };
        }
        return item;
      }));
    }
    setHasChanges(true);
  };

  const saveChanges = async () => {
    try {
      // Здесь будет отправка на сервер
      // await api.updateMenuItems(menuItems);
      
      setOriginalItems([...menuItems]);
      setHasChanges(false);
      
      toast({
        title: "Изменения сохранены",
        description: "Стоп-лист успешно обновлен",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить изменения",
        variant: "destructive",
      });
    }
  };

  const discardChanges = () => {
    setMenuItems([...originalItems]);
    setHasChanges(false);
    toast({
      title: "Изменения отменены",
      description: "Возвращены к последнему сохранению",
    });
  };

  const availableCount = menuItems.filter(item => item.isAvailable).length;
  const totalCount = menuItems.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-accent/20 to-primary/5">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                <h1 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  <ChefHat className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  {restaurantName}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Доступно {availableCount} из {totalCount} блюд
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                <Clock className="w-3 h-3 mr-1" />
                Онлайн
              </Badge>
              
              {hasChanges && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={discardChanges}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Отменить
                  </Button>
                  <Button
                    size="sm"
                    onClick={saveChanges}
                    className="bg-success hover:bg-success/90 text-success-foreground"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить
                  </Button>
                </div>
              )}

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-primary hover:text-primary hover:bg-primary/10"
                  >
                    <FolderPlus className="w-4 h-4 mr-2" />
                    Создать категорию
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Создать кастомную категорию</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input
                      placeholder="Название категории (например: Без света)"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <p className="text-sm text-muted-foreground">Выберите блюда для категории:</p>
                      {menuItems.map(item => (
                        <div key={item.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={item.id}
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedItems(prev => [...prev, item.id]);
                              } else {
                                setSelectedItems(prev => prev.filter(id => id !== item.id));
                              }
                            }}
                          />
                          <label htmlFor={item.id} className="text-sm flex-1 cursor-pointer">
                            {item.name} ({item.category})
                          </label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewCategoryName("");
                          setSelectedItems([]);
                          setIsCreateDialogOpen(false);
                        }}
                        className="flex-1"
                      >
                        Отменить
                      </Button>
                      <Button
                        onClick={createCustomCategory}
                        disabled={!newCategoryName.trim() || selectedItems.length === 0}
                        className="flex-1"
                      >
                        Создать
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
          {Object.entries(groupedItems).map(([category, items]) => {
            const categoryAvailableCount = items.filter(item => item.isAvailable).length;
            const categoryTotalCount = items.length;
            const hasAvailableItems = categoryAvailableCount > 0;
            const isCustomCategory = category.startsWith('🔥 ');
            
            return (
              <Card key={category} className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-lg sm:text-xl text-foreground">
                        {category}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-muted/50">
                        {categoryAvailableCount}/{categoryTotalCount}
                      </Badge>
                      {isCustomCategory && (
                        <Badge variant="outline" className="text-xs">
                          Кастомная
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant={hasAvailableItems ? "destructive" : "default"}
                        size="sm"
                        onClick={() => toggleCategoryStatus(category)}
                        className={`transition-all duration-300 text-xs sm:text-sm ${
                          hasAvailableItems 
                            ? "bg-warning hover:bg-warning/90 text-warning-foreground" 
                            : "bg-success hover:bg-success/90 text-success-foreground"
                        }`}
                      >
                        {hasAvailableItems ? "В стоп" : "Вернуть"}
                      </Button>
                      
                      {isCustomCategory && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const customCatName = category.replace('🔥 ', '');
                            const customCategory = customCategories.find(cat => cat.name === customCatName);
                            if (customCategory) {
                              deleteCustomCategory(customCategory.id);
                            }
                          }}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          Удалить
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all duration-300 ${
                        item.isAvailable
                          ? "bg-success-light/30 border-success/20 hover:border-success/40"
                          : "bg-warning-light/30 border-warning/20 hover:border-warning/40"
                      }`}
                    >
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-12 sm:w-20 sm:h-16 rounded-lg overflow-hidden bg-muted/50 border border-border/50">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Crect width='120' height='80' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'%3E🍽️%3C/text%3E%3C/svg%3E";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ChefHat className="w-4 h-4 sm:w-6 sm:h-6" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <h3 className={`font-medium text-sm sm:text-base leading-tight ${
                              item.isAvailable ? "text-foreground" : "text-muted-foreground line-through"
                            }`}>
                              {item.name}
                            </h3>
                            {item.isAvailable ? (
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-success flex-shrink-0" />
                            ) : (
                              <XCircle className="w-3 h-3 sm:w-4 sm:h-4 text-warning flex-shrink-0" />
                            )}
                          </div>
                          
                          {/* Mobile Toggle */}
                          <div className="flex items-center gap-2 sm:hidden">
                            <Switch
                              checked={item.isAvailable}
                              onCheckedChange={() => toggleItemStatus(item.id)}
                              className="data-[state=checked]:bg-success scale-75"
                            />
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <p className="text-sm sm:text-lg font-semibold text-primary">
                            {item.price}₽
                          </p>
                          
                          {/* Desktop Toggle */}
                          <div className="hidden sm:flex items-center gap-3">
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
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
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