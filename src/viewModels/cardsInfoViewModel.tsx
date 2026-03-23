import { CardInfo } from "../models/cardInfo";
import * as cardsInfoService from "../services/cardsInfoService";

export class CardsInfoViewModel {
  private cards: CardInfo[] = [];

  getCards(): CardInfo[] {
    return this.cards;
  }

  async cargarCardsActivas(): Promise<CardInfo[]> {
    const datos = await cardsInfoService.obtenerCardsActivas();
    this.cards = datos;
    return this.cards;
  }

  async obtenerCardPorId(id: string | number): Promise<CardInfo | null> {
    const idNum = typeof id === "string" ? Number(id) : id;
    if (isNaN(idNum)) return null;

    if (this.cards.length === 0) {
      await this.cargarCardsActivas();
    }

    const found = this.cards.find((c) => (c.carCodigo ?? 0) === idNum);
    if (found) return found;

    return cardsInfoService.obtenerCardPorId(idNum);
  }
}
