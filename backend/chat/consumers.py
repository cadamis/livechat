from channels import Channel, Group
from channels.sessions import channel_session
from channels.generic.websockets import JsonWebsocketConsumer
from .models import ChatRoom, ChatMessage


class ChatConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return ["livechat"]

    def receive(self, content, **kwargs):
        print(content)
        if content.get('type') == 'MESSAGE':
            data = content.get('data', {})
            channel = data.get('channel')
            username = data.get('username')
            message = data.get('message')

            if channel and username and message:
                room, _ = ChatRoom.objects.get_or_create(name=channel)
                chat_message = ChatMessage.objects.create(room=room, user=username, message=message)

                self.group_send("livechat", {
                    'type': 'MESSAGE_UPDATE',
                    'data': {
                        'channel': channel,
                        'username': username,
                        'message': message,
                    }
                })

    def disconnect(self, message, **kwargs):
        print(message)


# Connected to chat-messages
def msg_consumer(message):
    # Save to model
    room = message.content['room']
    ChatMessage.objects.create(
        room=room,
        message=message.content['message'],
    )
    # Broadcast to listening sockets
    Group("chat-%s" % room).send({
        "text": message.content['message'],
    })

# Connected to websocket.connect
@channel_session
def ws_connect(message):
    # Work out room name from path (ignore slashes)
    room = message.content['path'].strip("/")
    # Save room in session and add us to the group
    message.channel_session['room'] = room
    Group("chat-%s" % room).add(message.reply_channel)

# Connected to websocket.receive
@channel_session
def ws_message(message):
    # Stick the message onto the processing queue
    Channel("chat-messages").send({
        "room": message.channel_session['room'],
        "message": message['text'],
    })

# Connected to websocket.disconnect
@channel_session
def ws_disconnect(message):
    Group("chat-%s" % message.channel_session['room']).discard(message.reply_channel)