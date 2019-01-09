import { Notification } from '../observer/interfaces';
import * as React from 'react';
import JSONPretty from 'react-json-pretty';

export const NotificationViewer = ({
  notification,
}: {
  notification: Notification<any>;
}) => {
  if (!notification) {
    return <div />;
  }

  return (
    <div>
      <div>
        <strong>Type:</strong> {notification.type}
      </div>
      {notification.type === 'N' && (
        <div>
          <strong>Value:</strong>
          <JSONPretty data={JSON.stringify(notification.valueMeta.value)}/>
        </div>
      )}
      {notification.type === 'E' && (
        <div>
          <strong>Error:</strong> {notification.valueMeta.error}
        </div>
      )}
      <div>
        <strong>Time:</strong>{' '}
        {new Date(notification.timestamp).toLocaleString()}
      </div>
      <div>
        <strong>Step:</strong> {notification.step}
      </div>
      <div>
        <strong>Stream:</strong> {notification.streamId}
      </div>
    </div>
  );
};
