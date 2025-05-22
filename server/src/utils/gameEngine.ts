import { IVote } from '../models/game.model';
import { ICard } from '../models/card.model';

interface Votes {
  [key: string]: IVote[];
}

// to synchronise with front
const calculatorXp = (stepStart: number, stepEnd: number, hp: number, isWin: boolean): number => {
  if (!isWin) return hp;
  const bet = hp * 1000;
  const time = (stepEnd - stepStart) / 1000;
  return parseInt(Math.cbrt((4 * bet / time) / 5) + '');
};

const calculatorHp = (votes: Votes, cards: ICard[], hp: number, playerWinIsMalus: boolean): number => {
  let newHp = hp;
  const players = Object.keys(votes);
  
  for (let i = 0; i < players.length; i++) {
    for (let j = 0; j < votes[players[i]].length; j++) {
      if (!cards[j]) continue;
      const isPlayerWin = votes[players[i]][j].choice === Number(cards[j].isAI);
      const malus = (isPlayerWin ? 1 : -1) * (playerWinIsMalus ? -1 : 1);
      newHp = newHp + calculatorXp(
        votes[players[i]][j].stepStart,
        votes[players[i]][j].stepEnd,
        votes[players[i]][j].hp,
        playerWinIsMalus ? true : isPlayerWin,
      ) * malus;
    }
  }
  return newHp;
};

export {
  calculatorHp,
  calculatorXp,
};
