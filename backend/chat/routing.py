from channels.routing import route, route_class
from .consumers import ChatConsumer

channel_routing = [
    route_class(ChatConsumer, path="/chat/")
]