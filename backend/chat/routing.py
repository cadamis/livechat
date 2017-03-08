# in routing.py
from channels.routing import route, route_class
# from myapp.consumers import ws_connect, ws_message, ws_disconnect
from .consumers import ChatConsumer

channel_routing = [
    route_class(ChatConsumer, path="/chat/")
]