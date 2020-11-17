import {
  Box, LinearProgress, List,
  ListItem,

  ListItemIcon,

  ListItemSecondaryAction, ListItemText,

  SvgIconTypeMap,

  Typography
} from "@material-ui/core";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import Alert from "@material-ui/lab/Alert";
import AutoActionButton from "../action/AutoActionButton";
import ResultsPlaceholder from "../indicators/ResultsPlaceholder";
import IAutoAction from "../interfaces/IAutoAction";
import IErrorProps from "../interfaces/IErrorProps";

export interface IAutoListItem {
  id: string;
  value: any;
  icon?: OverridableComponent<SvgIconTypeMap>;
  actions?: IAutoAction[];
}

export interface IAutoListProps<T extends IAutoListItem> extends IErrorProps {
  items?: T[];
  isLoading: boolean;
}

export interface IItemRendererProps {
  item: IAutoListItem;
}

const ItemRenderer = (props: IItemRendererProps) => {
  const IconComponent = props.item.icon;

  return (
    <ListItem>
      {IconComponent && (
        <ListItemIcon>
          <IconComponent fontSize="small" />
        </ListItemIcon>
      )}
      <ListItemText>
        <Typography variant="body2">{props.item.value}</Typography>
      </ListItemText>
      {props.item.actions &&
        props.item.actions.map((action) => (
          <ListItemSecondaryAction key={action.id}>
            <AutoActionButton action={action} />
          </ListItemSecondaryAction>
        ))}
    </ListItem>
  );
};

function AutoList<T extends IAutoListItem>(props: IAutoListProps<T>) {
  return props.isLoading ? (
    <Box sx={{ p: 2 }}>
      <LinearProgress />
    </Box>
  ) : (
      <List>
        {props.error ? (
          <Alert severity="error">
            {(props.error || "Unknown error").toString()}
          </Alert>
        ) : (
            <>
              {props.items &&
                props.items.length > 0 &&
                props.items.map((i) => <ItemRenderer key={i.id} item={i} />)}
              {(!!!props.items || props.items.length <= 0) && (
                <ListItem>
                  <ResultsPlaceholder />
                </ListItem>
              )}
            </>
          )}
      </List>
    );
}

export default AutoList;
