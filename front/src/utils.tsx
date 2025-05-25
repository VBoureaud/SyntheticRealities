import { Vote, CardResult } from "./store/types";

export function makeId(length: number) {
   var result = '';
   var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
   var charactersLength = characters.length;
   for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

export function clone(obj: any) {
   if (null == obj || "object" != typeof obj) return obj;
   var copy = obj.constructor();
   for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
   }
   return copy;
}

export function getRandomArbitrary(min: number, max: number) {
   return Math.random() * (max - min) + min;
}

export function getSecFromMilli(milliseconds: number) {
   return (milliseconds / 1000).toFixed(0);
}

export const findByIdInArrayOfObj = (objects: any, id: number) => {
   for (let i = 0; i < objects.length; i++) {
      if (objects[i].id === id) return i;
   }
}
export function calculateScoreByVote(playerVote: Vote[], cards: number[], cardResult: CardResult[]) {
   for (let i = 0; i < playerVote.length; i++) {
      const choice = playerVote[i].choice;
      const idChoice = findByIdInArrayOfObj(cardResult, cards[i]);
      const card = idChoice ? cardResult[idChoice] : null;
      /*if (!card || choice != card.choice)
         console.log('hp loss');
      else
         console.log('hp gain');*/
   }
   return 0;
}

export function positifNumberOrZero(num: number) {
   return num >= 0 ? num : 0;
}

export const displayDate = (dateStr: string, withHours = false, dateObj: any) => {
   if (!dateStr && !dateObj)
      return '';
   // const monthNamesFull = ["January", "February", "March", "April", "May", "June",
   //     "July", "August", "September", "October", "November", "December"
   // ];
   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
   ];
   const myDate = !dateObj ? new Date(parseInt(dateStr)) : dateObj;
   const fullDate = monthNames[myDate.getMonth()] + ' '
      + ('0' + myDate.getDate()).slice(-2) + ', ' +
      + myDate.getFullYear();

   /*const fullDate = ('0' + (myDate.getMonth() + 1)).slice(-2) + '/'
     + ('0' + myDate.getDate()).slice(-2) + '/' + 
     + myDate.getFullYear();*/
   const fullHours = ('0' + myDate.getHours()).slice(-2)
      + ':' + ('0' + myDate.getMinutes()).slice(-2)
      + ':' + ('0' + myDate.getSeconds()).slice(-2);
   return fullDate + (withHours ? ' ' + fullHours : '');
}

export const buildRequest = async (url: string, method: string, body?: any) => {
   const data = await fetch(url, {
      method: method,
      headers: {
         "Content-Type": "application/json;charset=utf-8",
      },
      body: method !== "GET" ? JSON.stringify(body) : null,
   })
      .then((response) => response.json())
      .then((response) => {
         if (!response) throw new Error("Request Fail");
         else if (response.code) {
            throw new Error(response.message);
         }
         return response;
      });

   return data;
};

export const calculatorXp = (stepStart: number, stepEnd: number, hp: number, isWin: boolean) => {
   if (!isWin) return hp;
   const bet = hp * 1000;
   const time = (stepEnd - stepStart) / 1000;
   return parseInt(Math.cbrt((4 * bet / time) / 5) + '');
}

export const calculatorHp = (votes: any, cards: any, hp: number, playerWinIsMalus: boolean) => {
   let newHp = hp;
   const players = Object.keys(votes);
   for (let i = 0; i < players.length; i++) {
      // calculate with all players votes
      for (let j = 0; j < votes[players[i]].length; j++) {
         if (!cards[j]) continue;
         const isPlayerWin = votes[players[i]][j].choice == Number(cards[j].isAI);
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
}

export const findStrInArray = (array: string[], toFind: string) => {
   for (let index = 0; index < array.length; index++) {
      if (array[index].indexOf(toFind) !== -1)
         return index;
   }
   return -1;
}