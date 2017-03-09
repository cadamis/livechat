from channels.generic.websockets import JsonWebsocketConsumer
from .models import ChatRoom, ChatMessage


class ChatConsumer(JsonWebsocketConsumer):
    def connection_groups(self, **kwargs):
        return ["livechat"]

    def receive(self, content, **kwargs):
        if content.get('type') == 'MESSAGE':
            data = content.get('data', {})
            room_name = data.get('room')
            username = data.get('username')
            message = data.get('message')

            if room_name and username and message:
                room, _ = ChatRoom.objects.get_or_create(name=room_name)
                chat_message = ChatMessage.objects.create(room=room, user=username, message=message)

                self.group_send("livechat", {
                    'type': 'MESSAGE_UPDATE',
                    'data': {
                        'room': room_name,
                        'username': username,
                        'message': message,
                    }
                })
        elif content.get('type') == "JOIN_ROOM":
            data = content.get('data', {})
            room_name = data.get('room')
            print(room_name)
            if room_name:
                room, _ = ChatRoom.objects.get_or_create(name=room_name)
                recent_messages = ChatMessage.objects.filter(room=room)[:15]

                self.send({
                    'type': 'RECENT_MESSAGES',
                    'data': {
                        'messages': [{
                            'room': m.room.name,
                            'username': m.user,
                            'message': m.message,
                        } for m in recent_messages],
                    }
                })



    def disconnect(self, message, **kwargs):
        pass




