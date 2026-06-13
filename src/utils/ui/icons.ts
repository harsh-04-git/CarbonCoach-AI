import { Zap, Leaf, ShoppingCart, Plane, Car } from "lucide-react";

export const getCategoryIcon = (category: string) => {
  switch (category) {
    case "energy": return Zap;
    case "food": return Leaf;
    case "shopping": return ShoppingCart;
    case "flights": return Plane;
    default: return Car;
  }
};
