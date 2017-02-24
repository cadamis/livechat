from django.db import models


class ChatRoom(models.Model):
    name = models.CharField(max_length=80)


class ChatMessage(models.Model):
    room = models.ForeignKey(ChatRoom)
    user = models.CharField(max_length=120)
    message = models.TextField(verbose_name="Message")
