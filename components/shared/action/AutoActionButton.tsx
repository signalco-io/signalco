import { IconButton, Button } from "@material-ui/core";
import IAutoAction from "../interfaces/IAutoAction";
import { useState } from "react";
import HttpService from "../../../src/services/HttpService";

export interface IAutoActionButtonProps {
  action: IAutoAction;
}

export default function AutoActionButton(props: IAutoActionButtonProps) {
  const { action } = props;
  const isHref = action.url && action.method == null;

  const [isExecuting, setIsExecuting] = useState(false);

  const triggerAction = async (action: IAutoAction) => {
    if (action.method == null)
      throw new Error("Method is required for triggering action via request.");

    setIsExecuting(true);

    try {
      const response = await HttpService.requestAsync(
        action.url,
        action.method,
        action.data
      );

      if (action.actionCallback) action.actionCallback(response, action);
    } catch (err) {
      // TODO: Dispatch notification
    } finally {
      setIsExecuting(false);
    }
  };

  const handleClick = () => {
    if (action.onClick) action.onClick(action);
    if (action.method) triggerAction(action);
  };

  if (isHref) {
    return action.icon ? (
      <IconButton
        aria-label={action.label}
        title={action.label}
        href={action.url}
        target="_blank"
        onClick={handleClick}
        disabled={isExecuting}
      >
        {action.icon}
      </IconButton>
    ) : (
      <Button
        variant="text"
        href={action.url}
        target="_blank"
        onClick={handleClick}
        disabled={isExecuting}
      >
        {action.label}
      </Button>
    );
  } else {
    return action.icon ? (
      <IconButton
        aria-label={action.label}
        title={action.label}
        onClick={handleClick}
        disabled={isExecuting}
      >
        {action.icon}
      </IconButton>
    ) : (
      <Button variant="text" disabled={isExecuting} onClick={handleClick}>
        {action.label}
      </Button>
    );
  }
}
