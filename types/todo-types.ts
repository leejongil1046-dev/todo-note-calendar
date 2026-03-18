export type TodoCategory = {
  id: string;
  name: string;
  color: string;
};

export type CardColor =
  | "#EAF4FF"
  | "#EAFBF3"
  | "#F3EEFF"
  | "#FFF1E8"
  | "#FFF9DB"
  | "#FDEEF3";

export const COLOR_OPTIONS: CardColor[] = [
  "#EAF4FF",
  "#EAFBF3",
  "#F3EEFF",
  "#FFF1E8",
  "#FFF9DB",
  "#FDEEF3",
];
