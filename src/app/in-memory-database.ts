import { InMemoryDbService } from "angular-in-memory-web-api";

import { Category } from "./pages/categories/shared/category-model";

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categories: Category[] = [
      {
        id: 1,
        name: "Lazer",
        description: "Cinema, praia, churrasco"
      },
      {
        id: 2,
        name: "Moradia",
        description: "Aluguel e cachê da república"
      },
      {
        id: 3,
        name: "Salário",
        description: "Recebimento do salário"
      },
      {
        id: 4,
        name: "Saúde",
        description: "Plano de saúde, remédios"
      }
    ];

    return { categories };
  }
}
