export default interface IPayForMessage {
  block: {
    height: number;
    id: string;
  };
  timestamp: Date;
  namespace: string;
  data: {
    raw: string;
  };
  account: string;
  index: number;
};