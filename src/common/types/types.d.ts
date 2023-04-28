export type Error = {
  name: string;
  message: string;
  code?: string;
  detail?: string;
  meta?: {
    target?: string;
    cause?: string;
  };
};

export type JwtPayload = {
  id?: number;
  email: string;
};

export type ScoreOrder = 'asc' | 'desc';
