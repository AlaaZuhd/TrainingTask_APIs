from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.db.models.manager import BaseManager

from Posts.models import Post
from Users.models import CreateUdateDates

class CommentManager(models.Manager):

    # def get_queryset(self):
    #     return Comment.objects.filter(owner__is_active=True, post__owner__is_active=True)

    def create_comment(self, request_user, post_id, **extra_fields):
        if(extra_fields['image']):
            extra_fields['image'] = "avatar.png"
        if(extra_fields['content']):
            extra_fields['content'] = extra_fields['content'][0]
        print(extra_fields)
        comment = self.model(**extra_fields)
        post = Post.objects.filter(id=post_id).first()
        comment.owner= request_user
        comment.post= post
        comment.save()
        return comment



# Create your models here.
class Comment(CreateUdateDates):
    content = models.TextField()
    owner = models.ForeignKey('Users.CustomUser', null=True, related_name='comments', on_delete=models.CASCADE)
    post = models.ForeignKey('Posts.Post',null=True, related_name='comments', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='Comments/static/images', height_field=None, width_field=None, max_length=None)
    objects= CommentManager()
    def __str__(self):
        return self.content

    def create(self, reqeust_user, post_id, validated_data):
        return Comment.objects.create_comment(reqeust_user, post_id, **validated_data)




