export default interface IAutoAction {
  id: string;
  label: string;
  icon?: React.Component;
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  data?: string | object;
  onClick: (action: IAutoAction) => void;
  actionCallback?: (response: any, action: IAutoAction) => void;
}
