from django.db import models


class ChatRoom(models.Model):
    name = models.CharField(max_length=80)


class ChatMessage(models.Model):
    received = models.DateTimeField(auto_now=True)
    room = models.ForeignKey(ChatRoom)
    user = models.CharField(max_length=120)
    message = models.TextField(verbose_name="Message")
