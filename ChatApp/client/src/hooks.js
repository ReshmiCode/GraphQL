import { useQuery, useMutation, useSubscription } from '@apollo/react-hooks';
import {
  messagesQuery,
  addMessageMutation,
  messageAddedSubscription,
} from './graphql/queries';

export function useChatMessages() {
  const { loading, data } = useQuery(messagesQuery);
  const messages = data ? data.messages : [];
  useSubscription(messageAddedSubscription, {
    onSubscriptionData: ({ client, subscriptionData }) =>
      client.writeData({
        data: { messages: messages.concat(subscriptionData.data.messageAdded) },
      }),
  });
  const [addMessage, { error, called }] = useMutation(addMessageMutation);
  return {
    messages,
    addMessage: (text) => addMessage({ variables: { input: { text } } }),
  };
}
